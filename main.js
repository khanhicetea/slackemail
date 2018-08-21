const express = require('express');
const bodyParser = require('body-parser');
const crypto = require("crypto");
const util = require('util');
const nodemailer = require('nodemailer');
const moment = require('moment');

const checkSignature = function(value, sign, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  return sign == hmac.update(value.toString()).digest("hex");
};

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

const SECRET_KEY = process.env.SECRET_KEY || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || 587);
const SMTP_ENCRYPT = process.env.SMTP_ENCRYPT || 'tls';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_FROM = process.env.SMTP_FROM || '';
const SMTP_SENDER = process.env.SMTP_SENDER || '';
const SMTP_TO = process.env.SMTP_TO || '';

const app = express();

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }));

app.post('/send/:app/:signature', function(req, res) {
  const app = req.params.app;
  const signature = req.params.signature;

  if (!checkSignature(app, signature, SECRET_KEY)) {
    res.status(400);
    return res.end();
  }

  const secured = {'tls': 2, 'ssl': 1}[SMTP_ENCRYPT] || 0;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: (secured == 1 ? true : false),
    requireTLS: (secured == 2 ? true : false),
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
  });

  const now = moment().format('DD-MM-YY HH:mm');
  const body = req.body.text || req.rawBody;
  const from = SMTP_SENDER ? util.format('"%s" %s', SMTP_SENDER, SMTP_FROM) : SMTP_FROM;
  const mailOptions = {
    from: from,
    to: SMTP_TO,
    subject: util.format('[%s] New message from #%s', now, app),
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500);
      return res.end();
    } else {
      return res.send('OK!');
    }
  });
});

app.listen(3000, '127.0.0.1');