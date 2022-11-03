export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.message == undefined) {
    return res.status(406).json("Missing Message");
  }
  return fetch(process.env.GCHAT_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
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
