FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app/dist /app/dist
COPY server.js /app/server.js
WORKDIR /app
EXPOSE 3000
CMD ["node", "server.js"]