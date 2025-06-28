const Messages = require("../model/messages");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");

exports.uploadMessageImages = uploadMixOfImages([
  {
    name: "images",
    maxCount: 7,
  },
]);

exports.resizeMessageImages = catchAsyncErrors(async (req, res, next) => {
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `message-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255 }, // optional white background padding
          })
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/messages/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// create new message
exports.createNewMessage = catchAsyncErrors(async (req, res, next) => {
  const { conversationId, sender, text, images } = req.body;

  const message = new Messages({
    conversationId,
    text,
    sender,
    images,
  });

  await message.save();

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
