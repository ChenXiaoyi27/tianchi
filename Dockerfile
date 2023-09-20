#FROM node:16.18.0
FROM registry.cn-hangzhou.aliyuncs.com/chenxiaoyi/node14:latest
WORKDIR /app
COPY package*.json /app/
RUN npm i
# --legacy-peer-deps
# --registry=https://mirrors.cloud.tencent.com/npm/
COPY . /app
RUN npm run build

#FROM nginx:stable-alpine
FROM docker push registry.cn-hangzhou.aliyuncs.com/chenxiaoyi/nginx:1.24.0
COPY --from=0 /app/build /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
