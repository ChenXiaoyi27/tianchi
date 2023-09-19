FROM node:16.18.0
WORKDIR /app
COPY package*.json /app/
RUN npm i
# --registry=https://mirrors.cloud.tencent.com/npm/
COPY . /app
RUN npm run build

FROM nginx:stable
COPY --from=0 /app/build /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
