import mongoose from 'mongoose'

const config = require('../config.json').database

export default async function () {
  try {
    await mongoose.connect(config.HOST)
    console.log('connected')
  } catch (e) {
    console.error('connection error:', e)
    throw e
  }

  // Stores a notification
  const notificationSchema = mongoose.Schema({
    hash: {type: String, index: {unique: true, dropDups: true}},
    message: {type: String},
    read: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    date: {type: Date, default: Date.now},
    type: {type: String, default: 'info'},
    category: {type: String, default: null}
  })
  // notificationSchema.index({ name: 'hash', type: -1 })
  mongoose.model('notification', notificationSchema)

  // Stores the last lookup for notifications a client has done, in order not to create notifications from the past
  const postLockSchema = mongoose.Schema({
    category: {type: String, default: null},
    date: {type: Date, default: Date.now}
  })
  mongoose.model('postLock', postLockSchema)
}
