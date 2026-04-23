# Etapa 1 — build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2 — runtime
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV NG_ALLOWED_HOSTS=*

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "dist/Financist.Web/server/server.mjs"]
