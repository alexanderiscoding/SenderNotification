export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.coduser, req.body.topic, req.body.activate].includes(undefined)) {
    return res.status(406).json("Missing Information");
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
    return fetch(process.env.CLOUD_HOST + '/api/messaging/topic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': process.env.CLOUD_TOKEN
      },
      body: JSON.stringify({
        registrationTokens: [data.registrationToken],
        topic: req.body.topic,
        activate: req.body.activate
      })
    }).then(async function () {
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
            topic: {
              [req.body.topic]: req.body.activate
            }
          }
        })
      }).then(function () {
        res.status(200).json('User device changed in topic.');
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }).catch(function (error) {
      res.status(500).json(error);
    });
  }).catch(function (error) {
    res.status(500).json(error);
  });
}