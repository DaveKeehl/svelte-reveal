FROM node:17

WORKDIR /app

COPY package*.json ./

RUN npm install -g eslint prettier

RUN npm install

COPY . .

CMD ["npm", "run", "test:watch"]