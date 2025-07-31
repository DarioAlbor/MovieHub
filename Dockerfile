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

COPY .env.example ./.env.local

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]