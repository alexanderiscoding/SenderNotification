export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.message, req.body.buttonText, req.body.buttonUrl].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  return fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: req.body.message
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: req.body.buttonText,
              emoji: true
            },
            url: req.body.buttonUrl,
            action_id: "button-action"
          }
        }
      ]
    })
  })
  .then(function () {
    res.status(200).json('Message send.');
  })
  .catch(function (error) {
    res.status(500).json(error);
  });
}