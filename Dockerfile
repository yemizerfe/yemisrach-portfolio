# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Portfolio site (Next.js) + contact API (server/server.js) in one image.
#
# Two processes, because the backend is deliberately its own service: the site
# is served on 3000, the API on 4000. Neither needs a database.
# ---------------------------------------------------------------------------

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# The API keeps its own dependencies so the site's image does not carry Express.
FROM node:22-alpine AS api-deps
WORKDIR /api
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time, so they are build arguments
# rather than runtime environment. They are public by definition.
ARG NEXT_PUBLIC_SITE_URL=https://yemisrach-zerfe.vercel.app
ARG NEXT_PUBLIC_EMAILJS_SERVICE_ID
ARG NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
ARG NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
ARG NEXT_PUBLIC_EMAILJS_TO_EMAIL
ARG NEXT_PUBLIC_CONTACT_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=$NEXT_PUBLIC_EMAILJS_SERVICE_ID \
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$NEXT_PUBLIC_EMAILJS_TEMPLATE_ID \
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY \
    NEXT_PUBLIC_EMAILJS_TO_EMAIL=$NEXT_PUBLIC_EMAILJS_TO_EMAIL \
    NEXT_PUBLIC_CONTACT_API_URL=$NEXT_PUBLIC_CONTACT_API_URL \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    API_PORT=4000 \
    HOSTNAME=0.0.0.0

# `output: "standalone"` has already traced the site's dependencies.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=api-deps /api/node_modules ./server/node_modules
COPY --from=builder /app/server ./server

EXPOSE 3000 4000

# The API supervisor is the background process; the site is PID 1 so a stop
# signal reaches it directly. Containers send SIGTERM to the shell's child.
CMD ["sh", "-c", "node server/server.js & exec node server.js"]
