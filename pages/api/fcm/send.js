export default function handler(req, res) {
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.title, req.body.body].includes(undefined)) {
    return res.status(406).json("Missing Information");
  }
  let message = {};
  message['title'] = req.body.title;
  message['body'] = req.body.body;
  if (req.body.data) {
    message['data'] = req.body.data;
  }
  if (req.body.icon) {
    message['icon'] = req.body.icon;
  }
  if (req.body.color) {
    message['color'] = req.body.color;
  }
  if (req.body.image) {
    message['image'] = req.body.image;
  }
  if (req.body.coduser) {
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
      message['token'] = data.registrationToken;
      return fetch(process.env.CLOUD_HOST + '/api/messaging/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': process.env.CLOUD_TOKEN
        },
        body: JSON.stringify(message)
      }).then(function () {
        res.status(200).json('Message send.');
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }).catch(function (error) {
      res.status(500).json(error);
    });
  } else {
    message['topic'] = req.body.topic;
    return fetch(process.env.CLOUD_HOST + '/api/messaging/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': process.env.CLOUD_TOKEN
      },
      body: JSON.stringify(message)
    }).then(function () {
      res.status(200).json('Message send.');
    }).catch(function (error) {
      res.status(500).json(error);
    });
  }
}