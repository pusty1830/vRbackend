const coinService = require("../services/coinService");

module.exports = async () => {
  try {
    const data = await coinService.fetchLiveDataFromCoinGecko();
    const transformed = data.map((c) => ({
      coinId: c.id,
      name: c.name,
      symbol: c.symbol,
      price: c.current_price,
      marketCap: c.market_cap,
      change24h: c.price_change_percentage_24h,
      timestamp: new Date(),
    }));

    await coinService.overwriteCurrentData(transformed);
    await coinService.saveToHistory(transformed);

    console.log("✅ CRON: Data fetched and saved");
  } catch (err) {
    console.error("❌ CRON job error:", err.message);
  }
};
