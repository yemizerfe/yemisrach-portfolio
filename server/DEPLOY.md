# Deploying the API (`server/`)

A single Node process, no database, no build step. Delivers through **EmailJS**,
the same provider the site uses in the browser.

## Render (Web Service)

| Field | Value |
| --- | --- |
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/healthz` |

Environment variables (dashboard → Environment, not a `.env` upload):

| Key | Value |
| --- | --- |
| `EMAILJS_SERVICE_ID` | from EmailJS → Account → General |
| `EMAILJS_TEMPLATE_ID` | same page |
| `EMAILJS_PUBLIC_KEY` | same page |
| `EMAILJS_PRIVATE_KEY` | EmailJS → Account → Security → **API Keys** (secret) |
| `CONTACT_TO_EMAIL` | `yemisrachzerfe021@gmail.com` |
| `ALLOWED_ORIGINS` | your site origin, e.g. `https://yemisrach-zerfe.vercel.app` |

Do **not** set `PORT`/`API_PORT`: Render injects `PORT` and the server binds to
it (`PORT` wins over `API_PORT`, which exists for Docker).

Server-side sending with EmailJS also requires **API access to be enabled** for
the account (EmailJS → Account → Security). Without it the provider rejects the
request and the endpoint answers 502; without the private key it answers 503.

Verify after deploy:

```bash
curl https://your-service.onrender.com/healthz
# {"ok":true,"delivery":true}   delivery:true = keys were picked up
```

Then set `NEXT_PUBLIC_CONTACT_API_URL=https://your-service.onrender.com` in the
client's build environment and redeploy the client.

Free Render instances sleep when idle, so the first API submission after a pause
can take a few seconds. The browser EmailJS path is unaffected.

## Docker

```bash
docker build -t portfolio-api ./server
docker run -p 4000:4000 \
  -e EMAILJS_SERVICE_ID=service_xxx \
  -e EMAILJS_TEMPLATE_ID=template_xxx \
  -e EMAILJS_PUBLIC_KEY=xxxxxxx \
  -e EMAILJS_PRIVATE_KEY=xxxxxxxxxxxx \
  -e ALLOWED_ORIGINS=https://your-site.example \
  portfolio-api
```

The image sets `API_PORT=4000`; a `PORT` you pass in overrides it.

## Any Node host

```bash
cd server
npm ci
EMAILJS_SERVICE_ID=… EMAILJS_TEMPLATE_ID=… EMAILJS_PUBLIC_KEY=… EMAILJS_PRIVATE_KEY=… npm start
```

Environment is read per request, so rotating a key needs no rebuild. The rate
limiter is in-memory: per instance, cleared on restart.
