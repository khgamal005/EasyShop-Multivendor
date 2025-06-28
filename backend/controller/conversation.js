const Conversation = require("../model/conversation");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// create a new conversation
exports.createNewConversation = catchAsyncErrors(async (req, res, next) => {
  const { groupTitle, userId, sellerId } = req.body;

  const isConversationExist = await Conversation.findOne({ groupTitle });

  if (isConversationExist) {
    const conversation = isConversationExist;
    res.status(201).json({
      success: true,
      conversation,
    });
  } else {
    const conversation = await Conversation.create({
      members: [userId, sellerId],
      groupTitle: groupTitle,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  }
});

// get seller conversations

exports.getAllSellerConversation = catchAsyncErrors(async (req, res, next) => {
  const conversations = await Conversation.find({
    members: {
      $in: [req.params.id],
    },
  }).sort({ updatedAt: -1, createdAt: -1 });

  res.status(201).json({
    success: true,
    conversations,
  });
});

// get user conversations

exports.getAllUserConversation = catchAsyncErrors(async (req, res, next) => {
  const conversations = await Conversation.find({
    members: {
      $in: [req.params.id],
    },
  }).sort({ updatedAt: -1, createdAt: -1 });

  res.status(201).json({
    success: true,
    conversations,
  });
});

// update the last message

exports.updateLastMessage = catchAsyncErrors(async (req, res, next) => {
  const { lastMessage, lastMessageId } = req.body;

  const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
    lastMessage,
    lastMessageId,
  });

  res.status(201).json({
    success: true,
    conversation,
  });
});

