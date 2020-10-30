FROM node:12

WORKDIR /

COPY package.json package.json
COPY message_webhook_proxy.js message_webhook_proxy.js

RUN npm install

EXPOSE 8080
CMD [ "node", "message_webhook_proxy.js" ]
