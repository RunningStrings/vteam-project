FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN apt-get update && apt-get install -y tini && apt-get clean
ENTRYPOINT [ "/usr/bin/tini", "--"]

CMD ["/bin/sh"]
