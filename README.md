# URL Shortener Service

一個簡潔的 URL 縮短服務，使用 Node.js 和 Express 構建。

## 功能特點

- 將長網址轉換為短網址
- 短網址自動重定向到原始網址
- 查看短網碼的詳細資訊
- RESTful API 設計
- 簡單易用的介面

## 快速開始

### 環境需求

- Node.js 14.x 或更高版本
- npm 或 yarn

### 安裝步驟

1. 克隆專案：
   ```bash
   git clone https://github.com/HarryFan/express_short_url.git
   cd express_short_url
   ```

2. 安裝依賴：
   ```bash
   npm install
   # 或
   yarn
   ```

3. 啟動服務：
   ```bash
   npm start
   # 或
   yarn start
   ```

4. 服務將運行在 [http://localhost:3001](http://localhost:3001)

## API 文檔

### 建立短網址

```http
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url"
}
```

### 使用短網址

```
GET /:shortCode
```

### 獲取短網址資訊

```
GET /api/url/:shortCode
```

### 獲取所有短網址（測試用）

```
GET /api/urls
```

## 開發

### 開發模式

使用 nodemon 監聽檔案變更並自動重啟：

```bash
npm run dev
# 或
yarn dev
```

### 測試

```bash
npm test
# 或
yarn test
```

## 授權

MIT

## 作者

[你的名字] - [你的網站/個人資料連結]
