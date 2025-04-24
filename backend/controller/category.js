const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const category = require("../model/category");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ApiFeatures = require("../utils/apiFeatures");

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255 }, // optional white background padding
      })
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);
  }

  // Save image into our db
  req.body.image = filename;

  next();
});

exports.createCategory = asyncHandler(async (req, res) => {
  const newDoc = await category.create(req.body);
  res.status(201).json({ message: "categorycreated", data: newDoc });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  // Find the existing document
  const existingcategory = await category.findById(req.params.id);
  if (!existingcategory) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  // If new image is provided, remove the old image file
  if (req.body.image && existingcategory.image) {
    // Extract old filename from URL if it's a full path
    const oldFilename = existingcategory.image.split("/categories/")[1];
    const oldImagePath = path.join(
      __dirname,
      "../uploads/categories",
      oldFilename
    );

    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error("Error deleting old image:", err.message);
      } else {
        console.log("Old image deleted:", oldFilename);
      }
    });
  }

  // Update the categorydocument
  const document = await category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const existingcategory = await category.findById(req.params.id);
  if (!existingcategory) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  // Delete image from disk if it exists
  if (existingcategory.image) {
    // Extract filename in case image is a full URL
    const filename = existingcategory.image.split("/categories/")[1];
    const imagePath = path.join(__dirname, "../uploads/categories", filename);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err.message);
      } else {
        console.log("Image file deleted:", filename);
      }
    });
  }
  // Find and delete the category 
     const document = await  category.findByIdAndDelete(id);
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({
    message: "categorydeleted",
  }); // No Content
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // 1) Build query
  const document = await category.findById(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.getCategories = asyncHandler(async (req, res) => {

  // Build query
  const documentsCounts = await category.countDocuments();
  const apiFeatures = new ApiFeatures(category.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search(category)
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});
