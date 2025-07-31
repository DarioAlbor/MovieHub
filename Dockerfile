FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

ENV NUXT_OMDB_API_KEY=aeff7aa5
ENV NUXT_OMDB_API_URL=https://www.omdbapi.com
ENV NUXT_AUTH_TOKEN_NAME=auth_token
ENV NUXT_APP_URL=http://localhost:3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]