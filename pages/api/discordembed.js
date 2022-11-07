export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.message, req.body.content.title, req.body.content.description, req.body.content.url, req.body.content.thumbnail].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  return fetch(process.env.DISCORD_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      content: req.body.message,
      embeds: [
        {
          title: req.body.content.title,
          description: req.body.content.description,
          type: "rich",
          url: req.body.content.url,
          thumbnail: {
            url: req.body.content.thumbnail
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