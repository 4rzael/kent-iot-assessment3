'use strict'

import express from 'express'
import mongoose from 'mongoose'
import moment from 'moment'
import { omit } from 'underscore'
import { requiresBody, hashNotification } from '../utils'
import { mqttClient } from '../mqttConnection'

function clearNotif (notif, castToObject=true) {
  const obj = castToObject ? notif.toObject() : notif
  return omit(obj, 'deleted', '__v')
}

export default function () {
  const router = express.Router()
  const Notification = mongoose.model('notification')
  const PostLock = mongoose.model('postLock')

  router.get('/', async (req, res) => {
    try {
      let query = Notification.find({deleted: false}).sort({date: -1})
      if (req.query !== undefined && req.query.limit !== undefined) {
        query = query.limit(10)
      }
      const notifs = (await query.exec()).map(clearNotif)

      res.status(200).send(notifs)
    } catch (e) {
      console.error(e)
      res.status(404).send(e.toString())
    }
  })

  router.post('/', requiresBody(['message', 'date'],
    async (req, res) => {
      const message = req.body.message
      const date = moment(req.body.date).toDate()
      const category = req.body.category || null
      const type = req.body.type || 'info'


      const notif = {
        message,
        date,
        type,
        category
      }

      notif.hash = req.body.hash || hashNotification(notif)


      const existing = await Notification
        .findOne({hash: notif.hash})
        .exec()

      if (existing) {
        res.status(400).send('This notification already exist(ed)')
        return
      }

      // the notification itself does not exist...
      // Check if the notification is too old to be posted
      if (category) {
        const locker = await PostLock
        .findOne({category}, {})
        .exec()

        if (locker && locker.date >= date) {
          res.status(400).send(`Cannot post notifications older than ${locker.date}`)
          return
        }
      }

      // same as a create, but make sure there cannot be values in double (if it is atomic)
      const existed = await Notification.findOneAndUpdate(
        {hash: notif.hash},
        notif,
        {
          new: false,
          upsert: true,
          setDefaultsOnInsert: true
        }).exec()

      if (existed) {
        res.status(400).send('This notification already exist(ed)')
        return
      }

      const created = await Notification.findOne({hash: notif.hash}).exec()

      mqttClient.publish('/notifications', JSON.stringify(clearNotif(created)), {qos:2})

      res.status(200).send(clearNotif(created))
    })
  )

  router.param('notification_id', async (req, res, next, notification_id) => {
    const notif = await Notification
      .findOne({_id: notification_id})
      .exec()
    if (!notif) {
      res.status(404).send(`Cannot find notification with uuid ${notification_id}`)
    } else {
      next()
    }
  })

  router.put('/:notification_id/read', async (req, res) => {
    try {
      const notif = await Notification
        .findOneAndUpdate({_id: req.params.notification_id,deleted: false},
          {read: true},
          {new: true})
          .exec()
      res.status(200).send(clearNotif(notif))
    } catch (e) {
      res.status(404).send(`notification not found: ${e}`)
    }
  })

  router.delete('/reset_all', async (req, res) => {
    console.log('reseting the notification database... :(')
    try {
      await Notification
        .remove({})
        .exec()
      await PostLock
        .remove({})
        .exec()
      res.status(200).send()
    } catch (e) {
      console.error(e)
      res.status(400).send(`An error happened: ${e}`)
    }
  })

  router.delete('/:notification_id', async (req, res) => {
    try {
      await Notification
        .findOneAndUpdate({_id: req.params.notification_id,deleted: false},
          {deleted: true})
        .exec()
      res.status(200).send()
    } catch (e) {
      console.error(e)
      res.status(404).send(`Cannot delete element: ${e}`)
    }
  })

  router.put('/block_notifications', requiresBody(['category', 'date'],
    async (req, res) => {
      const date = moment(req.body.date).toDate()
      const category = req.body.category

      try {
        const blocker = await PostLock
          .findOneAndUpdate({category},
            {date},
            {
              new: true,
              upsert: true
            })
          .exec()
        res.status(200).send(blocker)
      } catch (e) {
        console.error(e)
        res.status(404).send(`Cannot block notifications: ${e}`)
      }
    })
  )

  return router
}
