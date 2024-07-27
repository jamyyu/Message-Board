FROM node:20

# 安裝系統依賴項
RUN apt-get update && apt-get install -y \
  libvips-dev \
  build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

RUN npm install \
  npm install --ignore-scripts=false --foreground-scripts --verbose sharp@0.32.6 \
  npm install --platform=linux --arch=x64 sharp@0.32.6 



COPY . .

EXPOSE 3000

CMD ["npm", "start"]