FROM node:20

WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "start"]