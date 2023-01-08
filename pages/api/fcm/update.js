export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.coduser, req.body.registrationToken].includes(undefined)) {
    return res.status(406).json("Missing Information");
  }
  return fetch(process.env.CLOUD_HOST + '/api/database/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': process.env.CLOUD_TOKEN
    },
    body: JSON.stringify({
      name: "SenderNotification",
      id: req.body.coduser,
      column: {
        registrationToken: req.body.registrationToken,
        timestamp: Date.now()
      }
    })
  }).then(function () {
    res.status(200).json('User device updated.');
  }).catch(function (error) {
    res.status(500).json(error);
  });
}