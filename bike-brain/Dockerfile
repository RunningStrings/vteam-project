FROM node:20

WORKDIR /app

COPY . .

RUN npm install

<<<<<<< HEAD
<<<<<<< HEAD
RUN apt-get update && apt-get install -y tini && apt-get clean
ENTRYPOINT [ "/usr/bin/tini", "--"]

CMD ["/bin/sh"]
=======
CMD ["node", "sim-from-database.js"]
>>>>>>> 2d5d2db (Change script to sim-from-database.js)
=======
RUN apt-get update && apt-get install -y tini && apt-get clean
ENTRYPOINT [ "/usr/bin/tini", "--"]

CMD ["node", "cli.js"]
>>>>>>> 9f89a47 (Adjust for interactivity with simulation client in container shell)
