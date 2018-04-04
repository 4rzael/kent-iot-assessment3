export const requiresBody = function (body, callback) {
  return function (req, res) {
    for (let b in body) {
      if (req.body[body[b]] === undefined) {
        res.status(400).send(`Missing parameter: ${body[b]}`)
        return
      }
    }
    return callback(req, res)
  }
}

export const hashNotification = function (notif) {
  const hash = require('node-object-hash')().hash

  return hash({
    message: notif.message,
    date: notif.date,
    type: notif.type,
    category: notif.categor
  })
}
