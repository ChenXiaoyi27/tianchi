#FROM node:16.18.0
FROM anolis-registry.cn-zhangjiakou.cr.aliyuncs.com/openanolis/node:16.17.1-nslt-8.6
WORKDIR /app
COPY package*.json /app/
RUN npm i
# --registry=https://mirrors.cloud.tencent.com/npm/
COPY . /app
RUN npm run build

#FROM nginx:stable-alpine
FROM registry.openanolis.cn/openanolis/nginx:1.14.1-8.6
COPY --from=0 /app/build /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
