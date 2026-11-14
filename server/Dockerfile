# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Server — the contact API. Served on 4000, no build step: plain Node ESM.
#
# Build from this folder:  docker build -t portfolio-api .
# ---------------------------------------------------------------------------

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    API_PORT=4000

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY contact.js email.js rate-limit.js server.js ./

USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||process.env.API_PORT||4000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Secrets (EMAILJS_PRIVATE_KEY, CONTACT_TO_EMAIL, ALLOWED_ORIGINS) are runtime
# environment, never build args.
CMD ["node", "server.js"]
