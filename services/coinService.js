const axios = require("axios");
const CurrentCoin = require("../model/currentCoin");
const HistoryCoin = require("../model/historyCoin");

const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets";

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
 * Overwrites CurrentCoin collection with fresh data.
 * Automatically appends a timestamp to each coin.
 */
exports.overwriteCurrentData = async (coins) => {
  const timestampedCoins = coins.map((coin) => ({
    coinId: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.current_price,
    marketCap: coin.market_cap,
    priceChange24h: coin.price_change_percentage_24h,
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
