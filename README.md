# 靈魂占卜師 — Arcane Tarot Ritual

一個結合塔羅牌與 AI 深度解讀的占卜 Web 應用，使用 Groq API（LLaMA 模型）提供專業、不廢話的牌面分析。

## 功能特色

- **多種牌陣選擇**：單牌啟示、聖三角、時間之流、直指核心、二選一、萬用牌陣
- **AI 推薦牌陣**：根據問題自動推薦最適合的牌陣
- **深度 AI 解讀**：以諮詢師視角分析牌面，給出實際可行的建議
- **占卜歷史紀錄**：所有占卜結果儲存於本地 SQLite 資料庫
- **響應式設計**：支援手機與桌面裝置

## 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | HTML / CSS / Vanilla JS |
| 後端 | Python Flask |
| AI 推理 | Groq API（llama-3.3-70b-versatile） |
| 資料庫 | SQLite |
| 部署 | Heroku / 任何支援 Procfile 的平台 |

## 快速開始

### 1. 安裝依賴

```bash
pip install -r requirements.txt
```

### 2. 設定環境變數

```bash
export GROQ_API_KEY=你的_GROQ_API_KEY
```

> 可至 [https://console.groq.com](https://console.groq.com) 免費取得 API 金鑰

### 3. 啟動伺服器

```bash
python tarot.py
```

開啟瀏覽器前往 `http://localhost:5000`

## 部署至 Heroku

```bash
heroku create
heroku config:set GROQ_API_KEY=你的_GROQ_API_KEY
git push heroku main
```

## API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/interpret` | 送出牌面，取得 AI 解讀 |
| POST | `/api/recommend_spread` | 根據問題推薦牌陣 |
| GET  | `/api/history` | 取得占卜歷史紀錄 |

## 環境變數

| 變數名稱 | 必填 | 說明 |
|----------|------|------|
| `GROQ_API_KEY` | 是 | Groq 平台 API 金鑰 |
| `PORT` | 否 | 伺服器埠號（預設 5000） |
