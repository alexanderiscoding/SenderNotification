export default function handler(req, res) {
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.coduser == undefined) {
    return res.status(406).json("Missing CodUser");
  }
  return fetch(process.env.CLOUD_HOST + '/api/database/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': process.env.CLOUD_TOKEN
    },
    body: JSON.stringify({
      id: 'SenderNotification/' + req.body.coduser
    })
  }).then(async function (response) {
    const data = await response.json();
    res.status(200).json(data);
  }).catch(function (error) {
    res.status(500).json(error);
  });
}