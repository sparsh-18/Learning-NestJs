FROM node:21.3.0

# Create work dir
WORKDIR /socket-backend/src/app

# Copy package.json to work dir
COPY package*.json ./

RUN npm install

# copy from root to work dir
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]