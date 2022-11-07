export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.document, req.body.caption].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  if (process.env.TELEGRAM_DEFAULT) {
    return fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendDocument', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_DEFAULT,
        document: req.body.document,
        caption: req.body.caption
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
    return fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendDocument', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        chat_id: req.body.chatID,
        document: req.body.document,
        caption: req.body.caption
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