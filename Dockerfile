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

# 安裝指定版本的 sharp 並強制從原始碼編譯，指定操作系統和CPU架構
RUN npm install sharp@0.32.6 --platform=linux --arch=x64 --include=optional --build-from-source

COPY . .

EXPOSE 3000

CMD ["npm", "start"]