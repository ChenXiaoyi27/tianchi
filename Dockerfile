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
FROM registry.cn-hangzhou.aliyuncs.com/chenxiaoyi/nginx:1.22.1
COPY --from=0 /app/build /usr/local/nginx/html
COPY --from=0 /app/nginx.conf /usr/local/nginx/conf/nginx.conf
