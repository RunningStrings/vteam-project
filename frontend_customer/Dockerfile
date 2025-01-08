FROM node:20

WORKDIR /app

COPY package.json .
RUN npm install esbuild@0.24.2 --save-dev

COPY . .

EXPOSE 1337

CMD ["npm", "run", "dev", "--", "--host"]
#CMD ["npm", "run"]