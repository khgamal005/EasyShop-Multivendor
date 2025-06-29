const Messages = require("../model/messages");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadMessageImages = uploadSingleImage("image");

exports.resizeMessageImages = catchAsyncErrors(async (req, res, next) => {
  const filename = `message-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255 }, // optional white background padding
      })
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/messages/${filename}`);
  }

  // Save image into our db
  req.body.image = filename;

  next();
});

exports.createNewMessage = catchAsyncErrors(async (req, res, next) => {
  const { conversationId, sender, text, images = [] } = req.body;
if (!conversationId || !sender) {
  return next(new ErrorHandler("Missing required fields", 400));
}

  const message = new Messages({
    conversationId,
    text,
    sender,
    images,
  });

  await message.save();

  // Optionally populate sender or other fields if needed
  res.status(201).json({
    success: true,
    message,
  });
});

// get all messages with conversation id

exports.getAllMessagesWithConversationId = catchAsyncErrors(
  async (req, res, next) => {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });

    res.status(201).json({
      success: true,
      messages,
    });
  }
);
