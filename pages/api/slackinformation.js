export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.header, req.body.informations, req.body.footer].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  let informations = [];
  informations.push({
    type: "header",
    text: {
      type: "plain_text",
      text: req.body.header,
      emoji: true
    }
  });
  let customFields = [];
  let countFields = 0;
  req.body.informations.map(function({text}) {
    if(customFields.length > 0){
      customFields.push({
        type: "mrkdwn",
        text: text
      });
      informations.push({
        type: "section",
        fields: customFields
      });
      customFields = [];
    }else{
      customFields.push({
        type: "mrkdwn",
        text: text
      });
    }
    countFields++;
    if(req.body.informations.length == countFields && customFields.length == 1){
      informations.push({
        type: "section",
        fields: customFields
      });
    }
  });
  informations.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: req.body.footer
    }
  });
  return fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      blocks: informations
    })
  })
  .then(function () {
    res.status(200).json('Message send.');
  })
  .catch(function (error) {
    res.status(500).json(error);
  });
}