export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.title, req.body.subtitle, req.body.multiline, req.body.label, req.body.icon, req.body.buttonText, req.body.buttonUrl].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
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
              widgets: [
                {
                  keyValue: {
                    topLabel: req.body.title,
                    content: req.body.subtitle,
                    contentMultiline: req.body.multiline,
                    bottomLabel: req.body.label,
                    icon: req.body.icon,
                    button: {
                      textButton: {
                        text: req.body.buttonText,
                        onClick: {
                          openLink: {
                            url: req.body.buttonUrl
                          }
                        }
                      }
                    }
                  }
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