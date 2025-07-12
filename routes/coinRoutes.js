const express = require("express");
const router = express.Router();
const coinController = require("../controllers/coinController");

router.get("/coins", coinController.getLiveCoins);
router.post("/history", coinController.saveSnapshotToHistory);
router.get("/history/:coinId", coinController.getHistoricalData);
router.get("/history", coinController.getAllHistoricalData);

module.exports = router;
