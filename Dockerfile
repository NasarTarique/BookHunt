FROM node:16.14.0
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install 
COPY . /app
CMD ["node", "server.js"]

