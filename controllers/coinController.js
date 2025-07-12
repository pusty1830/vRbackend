const coinService = require("../services/coinService");
const HTTP = require("../utils/httpStatusCodes");
const MSG = require("../utils/messages");

exports.getLiveCoins = async (req, res, next) => {
  try {
    const coins = await coinService.getCachedLiveData();
    res.status(HTTP.OK).json({
      success: true,
      message: MSG.SUCCESS.LIVE_COINS_FETCHED,
      data: coins,
    });
  } catch (err) {
    next(err);
  }
};

exports.saveSnapshotToHistory = async (req, res, next) => {
  try {
    const coins = req.body;
    if (!Array.isArray(coins) || coins.length === 0) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: MSG.ERROR.INVALID_REQUEST_BODY,
      });
    }

    await coinService.saveToHistory(coins);
    res.status(HTTP.CREATED).json({
      success: true,
      message: MSG.SUCCESS.HISTORY_SAVED,
    });
  } catch (err) {
    next(err);
  }
};

exports.getHistoricalData = async (req, res, next) => {
  try {
    const { coinId } = req.params;
    const history = await coinService.getHistoricalData(coinId);

    if (!history || history.length === 0) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: MSG.ERROR.NOT_FOUND(coinId),
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      message: MSG.SUCCESS.HISTORY_FETCHED(coinId),
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllHistoricalData = async (req, res, next) => {
  try {
    const history = await coinService.getAllHistoricalData();

    if (!history || history.length === 0) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: MSG.ERROR.NO_HISTORY_FOUND,
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      message: MSG.SUCCESS.ALL_HISTORY_FETCHED,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};
