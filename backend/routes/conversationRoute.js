const express = require("express");

const {
  createNewConversation,
  getAllSellerConversation,
  getAllUserConversation,
  updateLastMessage
} = require("../controller/conversation");

const { isAdminOrSeller, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router
  .route("/create-new-conversation")
  .post(isAuthenticated, createNewConversation);
router
  .route("/get-all-conversation-seller/:id")
.get(isAuthenticated, isAdminOrSeller, getAllSellerConversation);
router
  .route("/get-all-conversation-user/:id")
.get(isAuthenticated, getAllUserConversation);
router
  .route("/update-last-message/:id")
.put(isAuthenticated, updateLastMessage);

module.exports = router;
