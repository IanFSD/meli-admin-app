FROM node:12-alpine as web

WORKDIR /web
COPY web  .
ENV API_URL /api
ENV RECAPTCHA_SITEKEY 6Lfk3QAVAAAAAOLKrzPvJpO7p8RalniJtfC43rwV
RUN yarn install \
    && yarn generate

WORKDIR /api
COPY api .
RUN yarn install \
    && yarn build

WORKDIR /tmp
COPY tmp.file .

WORKDIR /

CMD ["node", "/api/dist/main.js"]
