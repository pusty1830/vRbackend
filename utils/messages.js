module.exports = {
  SUCCESS: {
    LIVE_COINS_FETCHED: "Live coins fetched successfully.",
    HISTORY_SAVED: "Snapshot saved to history.",
    HISTORY_FETCHED: (coinId) => `Historical data for ${coinId} fetched.`,
  },
  ERROR: {
    INVALID_REQUEST_BODY: "Invalid or missing request body.",
    NOT_FOUND: (coinId) => `No history found for coin ID: ${coinId}.`,
    INTERNAL_SERVER_ERROR: "Internal server error.",
  },
};
