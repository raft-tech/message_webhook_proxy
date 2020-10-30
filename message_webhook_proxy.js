const PORT = process.env.PORT || 3000;
const URL = process.env.MM_URL;
const USER = process.env.MM_PROXY_USERNAME;
const TOKEN = process.env.MM_PROXY_TOKEN;

const express = require('express');
const request = require('request');

const app = express();

// start the proxy server
var server = app.listen(PORT, () => {
  // console.log('Starting Mattermost Proxy Server for ' + URL + " listening port " + PORT)
});

function postMsg(msg, channel) {
  // console.log('Posting to Mattermost: ', msg, channel)
  var uri = URL;
  var postData = {
    username: USER,
    channel_id: channel,
    props: {
      attachments: [{
        text: msg
      }]
    }
  };
  var options = {
    method: 'post',
    body: postData,
    json: true,
    url: uri,
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  };

  request(options, function (err, res, body) {
    if (err) {
      // console.error('error posting json: ', err)
      throw err;
    }
    // var headers = res.headers;
    // var statusCode = res.statusCode;
    // console.log('headers: ', headers)
    // console.log('statusCode: ', statusCode)
    // console.log('body: ', body)
  });

  return 'Complete';
}

// health check
app.get('/', (req, res) => res.send('Hello Mattermost Webhook Proxy!'));

// endpoint (e.g localhost:3000/post/channel/<channel_id>/msg/<message>)
app.use('/post/channel/:channel/msg/:msg', (req, res) => {
  if (!req.params.msg || !req.params.channel) {
    const err = new Error('Required query params missing');
    err.status = 400;
    throw err;
  }
  // console.log(`Payload: ${req.params}`)
  res.send(postMsg(req.params.msg, req.params.channel));
});

app.get('*', function(req, res, next) {
  const err = new Error('Page Not Found');
  err.statusCode = 404;
  next(err);
});

module.exports = server;
