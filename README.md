# SlackEmail

Receive email as slack notification via webhook (Slack webhook compatible)

## TL;DR

Using Docker to run

```bash
$ docker run -d -p 3000:3000 khanhicetea/slackemail
```

Then open **http://localhost:3000** to try a shot !

## Install & Start

Update the environment variables :

```bash
TIMEZONE=UTC
SECRET_KEY=HardToGuest
SMTP_HOST=
SMTP_PORT=587
SMTP_ENCRYPT=tls        
SMTP_USER=              
SMTP_PASSWORD=
SMTP_FROM=
SMTP_TO=
```

```bash
$ npm install
$ npm start
```

## Now.sh Deploying

```bash
$ now
```

## Webhook Endpoint

Endpoint : **https://[slackemail-domain]/send/[app_name]/[hmac_signature]**

- **slackemail-domain** : your SlackEmail hostname
- **app_name** : your app name, will be in title of email
- **hmac_signature** : HMAC SHA256 Signature of your **app_name** based on env **SECRET_KEY**, prevent someone guest your endpoint

## Example CURL

```bash
$ curl -X POST -H 'Content-type: application/json' --data '{"text":"This is a line of text.\nAnd this is another one."}' "https://[slackemail-domain]/send/[app_name]/[hmac_signature]"
```

## Contributors

- @khanhicetea

## License

MIT License