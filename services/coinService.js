const axios = require("axios");
const CurrentCoin = require("../model/currentCoin");
const HistoryCoin = require("../model/historyCoin");

const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches top 10 coins from CoinGecko with retry for rate limit (429).
 */
exports.fetchLiveDataFromCoinGecko = async () => {
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("[CoinGecko] Rate limited (429). Retrying after delay...");
      await new Promise((res) => setTimeout(res, 10000));
      return exports.fetchLiveDataFromCoinGecko();
    }
    console.error("[CoinGecko] Error fetching data:", error.message);
    throw error;
  }
};

/**
 * Returns cached live data from DB if it's recent,
 * otherwise fetches from CoinGecko and updates DB.
 */
exports.getCachedLiveData = async () => {
  const latest = await CurrentCoin.find({}).sort({ timestamp: -1 });

  if (latest.length > 0) {
    const lastUpdated = latest[0].timestamp;
    const now = new Date();

    const age = now - new Date(lastUpdated);

    if (age < CACHE_DURATION) {
      console.log("[Cache] Serving live coin data from cache.");
      return latest;
    }
  }

  console.log("[Cache] Cache expired or empty. Fetching fresh data...");
  const freshCoins = await exports.fetchLiveDataFromCoinGecko();
  await exports.overwriteCurrentData(freshCoins);
  return await CurrentCoin.find({}).sort({ marketCap: -1 });
};

/**
 * Overwrites CurrentCoin collection with fresh data.
 */
exports.overwriteCurrentData = async (coins) => {
  const timestampedCoins = coins.map((coin) => ({
    coinId: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.current_price,
    marketCap: coin.market_cap,
    change24h: coin.price_change_percentage_24h,
    timestamp: new Date(),
  }));


  await CurrentCoin.deleteMany();
  await CurrentCoin.insertMany(timestampedCoins);
};

/**
 * Saves a new snapshot to HistoryCoin collection.
 */
exports.saveToHistory = async (coins) => {
  const timestampedCoins = coins.map((coin) => ({
    coinId: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.current_price,
    marketCap: coin.market_cap,
    priceChange24h: coin.price_change_percentage_24h,
    timestamp: new Date(),
  }));

  await HistoryCoin.insertMany(timestampedCoins);
};

/**
 * Returns historical price data for a given coinId.
 */
exports.getHistoricalData = async (coinId) => {
  return await HistoryCoin.find({ coinId }).sort({ timestamp: 1 });
};

exports.getAllHistoricalData = async () => {
  return await HistoryCoin.find({}).sort({ timestamp: 1 });
};
