FROM node:22-alpine AS builder

RUN apk add --no-cache git

WORKDIR /olamovOS
COPY . .

RUN yarn
RUN yarn build

FROM node:22-alpine

WORKDIR /olamovOS
COPY --from=builder /olamovOS/out ./out

RUN npm install -g serve@latest

CMD ["serve", "out"]
