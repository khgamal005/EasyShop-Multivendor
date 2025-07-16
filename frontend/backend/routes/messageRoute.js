const express = require("express");

const {
  createMessage,
  uploadMessageImages,
  resizeMessageImages,
  getAllMessagesWithConversationId,
} = require("../controller/message");

const { isAdminOrSeller, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router
  .route("/create-new-message")
  .post(
    isAuthenticated,
    // uploadMessageImages,
    // resizeMessageImages,
    createMessage
  );
router
  .route("/get-all-messages/:id")
  .get(isAuthenticated, getAllMessagesWithConversationId);

module.exports = router;
