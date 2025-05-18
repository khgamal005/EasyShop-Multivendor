const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");
const asyncHandler = require("../middleware/catchAsyncErrors");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ApiFeatures = require("../utils/apiFeatures");



exports.uploadeventImages = uploadMixOfImages([
  {
    name: "images",
    maxCount: 7,
  },
]);
// Image processing
exports.resizeventImages = asyncHandler(async (req, res, next) => {
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `event-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255 }, // optional white background padding
          })
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/events/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});
// create event

exports.createEvent = asyncHandler(async (req, res) => {
  const shopId = req.seller.id;
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return next(new ErrorHandler("Shop Id is invalid!", 400));
  }
  req.body.shopId = shopId;

  const newDoc = await Event.create(req.body);

  res.status(201).json({ message: "event created", data: newDoc });
});


// // get all events

exports.getallEvents = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCounts = await Event.countDocuments();
  const apiFeatures = new ApiFeatures(
    Event.find(),
    req.query
  )
    .paginate(documentsCounts)
    .filter()
    .search(Product)
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});

exports.getallEventsofShop = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCounts = await Event.countDocuments();
  const apiFeatures = new ApiFeatures(
    Event.find({ shopId: req.seller.id }),
    req.query
  )
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});





// // delete event of a shop

exports.deletEvent = asyncHandler(async (req, res, next) => {
  const existingEvent = req.event;
  if (!existingEvent) {
    return next(
      new ErrorHandler(`No document for this id ${req.params.id}`, 404)
    );
  }

  // Delete images from disk (if filenames are stored directly)
  if (Array.isArray(existingEvent.images)) {
    existingEvent.images.forEach((filename) => {
      const imagePath = path.join(__dirname, "../uploads/events", filename);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err.message);
        } else {
          console.log("Deleted image:", filename);
        }
      });
    });
  }

  // Delete the product from DB
  const document = await Event.findByIdAndDelete(req.params.id);
  if (!document) {
    return next(
      new ErrorHandler(`No document for this id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

