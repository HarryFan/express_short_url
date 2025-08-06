const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 使用記憶體儲存
const urlDatabase = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 首頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 生成短網址
const generateShortCode = () => Math.random().toString(36).substring(2, 8);

// 創建短網址
app.post('/api/shorten', (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    // 驗證輸入
    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({ 
        status: 'error',
        error: '請提供有效的網址',
        received: originalUrl
      });
    }

    // 檢查是否已存在
    const existingEntry = Array.from(urlDatabase.entries())
      .find(([_, urlData]) => urlData.originalUrl === originalUrl);

    if (existingEntry) {
      const [shortCode, urlData] = existingEntry;
      return res.json({
        status: 'success',
        shortCode,
        shortUrl: `http://localhost:${PORT}/${shortCode}`,
        ...urlData
      });
    }

    // 創建新的短網址
    const shortCode = generateShortCode();
    const urlData = {
      originalUrl,
      shortCode,
      createdAt: new Date().toISOString(),
      visitCount: 0
    };

    // 存儲到記憶體
    urlDatabase.set(shortCode, urlData);

    res.json({
      status: 'success',
      shortCode,
      shortUrl: `http://localhost:${PORT}/${shortCode}`,
      ...urlData
    });
  } catch (error) {
    console.error('創建短網址錯誤:', error);
    res.status(500).json({
      status: 'error',
      error: '創建短網址時發生錯誤',
      details: error.message
    });
  }
});

// 重定向短網址
app.get('/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlData = urlDatabase.get(shortCode);

    if (!urlData) {
      return res.status(404).send('找不到此短網址');
    }

    // 更新訪問次數
    urlData.visitCount = (urlData.visitCount || 0) + 1;
    urlDatabase.set(shortCode, urlData);

    // 重定向到原始網址
    res.redirect(urlData.originalUrl);
  } catch (error) {
    console.error('重定向錯誤:', error);
    res.status(500).send('重定向時發生錯誤');
  }
});

// 獲取短網址資訊
app.get('/api/url/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlData = urlDatabase.get(shortCode);

    if (!urlData) {
      return res.status(404).json({
        status: 'error',
        error: '找不到此短網址'
      });
    }

    res.json({
      status: 'success',
      ...urlData
    });
  } catch (error) {
    console.error('獲取短網址資訊錯誤:', error);
    res.status(500).json({
      status: 'error',
      error: '獲取短網址資訊時發生錯誤'
    });
  }
});

// 獲取所有短網址（僅用於測試）
app.get('/api/urls', (req, res) => {
  res.json(Array.from(urlDatabase.entries()).map(([shortCode, data]) => ({
    shortCode,
    ...data
  })));
});

app.listen(PORT, () => {
  console.log(`🚀 短網址服務已啟動: http://localhost:${PORT}`);
  console.log('API 端點:');
  console.log(`- POST   /api/shorten   創建短網址`);
  console.log(`- GET    /:shortCode    訪問短網址`);
  console.log(`- GET    /api/url/:code 獲取短網址資訊`);
  console.log(`- GET    /api/urls      獲取所有短網址 (測試用)`);
});
