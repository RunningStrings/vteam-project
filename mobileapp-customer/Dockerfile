FROM node:18-alpine

# Environment variables for development
ENV NODE_ENV=development
ENV PORT=19006

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose necessary ports:
# - 19006: Expo's React Native packager
# - 19001: Debugging port for React Native
# - 19002: Debugging port for React Native
# - 8081: Metro Bundler, used for React Native bundling
EXPOSE 19006 19001 19002 8081

# Using tunnel to avoid problems with localhost
# Alternative command: CMD ["npm", "start"]
CMD ["npx", "expo", "start", "--", "--tunnel"]
