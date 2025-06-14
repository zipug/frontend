FROM node:20 AS builder

WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .

ARG VITE_APP_BASE_URL
ARG VITE_RESOURCES_WS_URL

ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}
ENV VITE_RESOURCES_WS_URL=${VITE_RESOURCES_WS_URL}

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
