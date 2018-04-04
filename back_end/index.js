'use strict'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import argparse from 'argparse'
import database from './database/index'
import notificationsRouter from './routes/notifications'
import mqttConnect from './mqttConnection'

const parser = new argparse.ArgumentParser({
  addHelp: true,
  description: 'The notification backend of the IoT assignement'
});

parser.addArgument(
  ['-f', '--forcedb'],
  {
    action: 'storeTrue',
    required: false,
    type: Boolean,
    help: 'Force the DB recreation'
  }
)

const args = parser.parseArgs();

async function run() {
  const app = express()
  app.use(cors())
  app.use(bodyParser.text())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  await database()
  const port = process.env.PORT || 3000
  await mqttConnect()

  app.use(notificationsRouter())

  console.log('Server listening on port', port);
  app.listen(port);
}

run()
