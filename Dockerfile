FROM node:19

WORKDIR /app

COPY package*.json ./

COPY packages/svelte-reveal/package.json ./packages/svelte-reveal/package.json

# RUN npm install -g eslint prettier

RUN npm install

COPY . .

CMD ["npm", "run", "build"]