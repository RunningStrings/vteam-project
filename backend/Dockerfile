FROM node:18

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 5000 5001

# CMD ["npm", "start"] # This is handled in docker-compose.yml, after seeding