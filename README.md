#Live Demo:-https://vrbackend-1.onrender.com

# 🛠 VR Crypto Tracker – Backend

A Node.js and Express.js backend that powers the full-stack **cryptocurrency tracker** for the VR Automations developer test.

This server fetches **live cryptocurrency data** from [CoinGecko API](https://www.coingecko.com/en/api), serves it via REST APIs, and stores historical data in MongoDB using an **hourly cron job**.

---

## 📦 Tech Stack

- **Backend Framework:** Express.js
- **Database:** MongoDB Atlas
- **Scheduler:** node-cron
- **HTTP Client:** Axios
- **Hosting:** Render 

---

## 🌐 API Endpoints

### `GET /api/coins`
- Fetches top 10 cryptocurrencies live from CoinGecko.
- Returns:
  - Name
  - Symbol
  - Price (USD)
  - Market Cap
  - 24h % Change
  - Last Updated Timestamp

### `POST /api/history`
- Captures the current coin data and appends it to the **HistoryData** collection.

### `GET /api/history/:coinId` (optional)
- Returns stored historical data for a specific coin.

---

## 🧠 Cron Job

- Runs every **1 hour** via `node-cron`
- Fetches top 10 crypto prices from CoinGecko
- Saves new documents to the **HistoryData** collection

You can find the job logic in:

```js
/corn/fetchAndStore.js
