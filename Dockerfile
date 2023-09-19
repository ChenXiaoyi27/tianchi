#FROM node:16.18.0
FROM chenxiaoyi27/node:14.21.3
WORKDIR /app
COPY package*.json /app/
RUN npm i
# --legacy-peer-deps
# --registry=https://mirrors.cloud.tencent.com/npm/
COPY . /app
RUN npm run build

FROM nginx:stable-alpine
#FROM registry.openanolis.cn/openanolis/nginx:1.14.1-8.6
COPY --from=0 /app/build /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
