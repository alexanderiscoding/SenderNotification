export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.header.title, req.body.header.subtitle, req.body.header.imageUrl, req.body.buttons].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
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
          header: {
            title: req.body.header.title,
            subtitle: req.body.header.subtitle,
            imageUrl: req.body.header.imageUrl,
            imageStyle: "IMAGE"
          },
          sections: [
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