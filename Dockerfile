FROM node:20

# 安裝系統依賴項
RUN apt-get update && apt-get install -y \
  libvips-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 設定環境變數以確保 sharp 從原始碼編譯
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
RUN npm install --build-from-source=sharp

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]