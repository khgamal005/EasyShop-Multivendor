const express = require("express");
const {
  createWithdrawRequest,
  getAllWithdrawRequests,
  updateWithdrawRequest,
} = require("../controller/withdraw");
const { isAdminOrSeller, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// Create a withdraw request - only for seller
router.post("/create-withdraw-request", isAdminOrSeller, createWithdrawRequest);

// Get all withdraw requests - admin only
router.get("/get-all-withdraw-request", isAuthenticated, isAdmin("Admin"), getAllWithdrawRequests);

// Update withdraw status - admin only
router.put("/update-withdraw-request/:id", isAuthenticated, isAdmin("Admin"), updateWithdrawRequest);

module.exports = router;
