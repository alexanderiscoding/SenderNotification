export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.message == undefined) {
    return res.status(406).json("Missing Message");
  }
  return fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: req.body.message
    })
  })
  .then(function () {
    res.status(200).json('Message send.');
  })
  .catch(function (error) {
    res.status(500).json(error);
  });
}
