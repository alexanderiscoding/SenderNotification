export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.informations, req.body.buttons].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  let informations = [];
  req.body.informations.map(function({title, subtitle}) {
    informations.push({
      keyValue: {
        topLabel: title,
        content: subtitle
      }
    });
  });
  let buttons = [];
  req.body.buttons.map(function({text, url}) {
    buttons.push({
      textButton: {
        text: text,
        onClick: {
          openLink: {
            url: url
          }
        }
      }
    });
  });
  return fetch(process.env.GCHAT_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      cards: [
        {
          sections: [
            {
              widgets: informations
            },
            {
              widgets: [
                {
                  buttons: buttons
                }
              ]
            }
          ]
        }
      ]
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