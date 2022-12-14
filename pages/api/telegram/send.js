export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.message == undefined) {
    return res.status(406).json("Missing Message");
  }
  if (process.env.TELEGRAM_DEFAULT) {
    if (req.body.custom) {
      return fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_DEFAULT,
          text: req.body.message,
          parse_mode: req.body.custom
        })
      })
        .then(async function (response) {
          const data = await response.json();
          res.status(200).json(data);
        })
        .catch(function (error) {
          res.status(500).json(error);
        });
    } else {
      return fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_DEFAULT,
          text: req.body.message
        })
      })
        .then(async function (response) {
          const data = await response.json();
          res.status(200).json(data);
        })
        .catch(function (error) {
          res.status(500).json(error);
        });
    }
  } else {
    if (req.body.custom) {
      return fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          chat_id: req.body.chatID,
          text: req.body.message,
          parse_mode: req.body.custom
        })
      })
        .then(async function (response) {
          const data = await response.json();
          res.status(200).json(data);
        })
        .catch(function (error) {
          res.status(500).json(error);
        });
    } else {
      return fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          chat_id: req.body.chatID,
          text: req.body.message
        })
      })
        .then(async function (response) {
          const data = await response.json();
          res.status(200).json(data);
        })
        .catch(function (error) {
          res.status(500).json(error);
        });
    }
  }
}