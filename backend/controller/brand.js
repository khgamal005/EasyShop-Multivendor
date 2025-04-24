const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const brand = require("../model/brand");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ApiFeatures = require("../utils/apiFeatures");



// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
    .resize(600, 600, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255 } // optional white background padding
      })      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);
  }

  // Save image into our db
  req.body.image = filename;

  next();
});



  exports.createBrand = asyncHandler(async (req, res) => {

   const newDoc = await brand.create(req.body);
    res.status(201).json({ message: "Brand created", data: newDoc });
  });



    exports.updateBrand = asyncHandler(async (req, res, next) => {
        // Find the existing document
        const existingBrand = await brand.findById(req.params.id);
        if (!existingBrand) {
          return next(new ApiError(`No document for this id ${req.params.id}`, 404));
        }
      
        // If new image is provided, remove the old image file
        if (req.body.image && existingBrand.image) {
          // Extract old filename from URL if it's a full path
          const oldFilename = existingBrand.image.split("/brands/")[1];
          const oldImagePath = path.join(__dirname, "../uploads/brands", oldFilename);
      
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting old image:", err.message);
            } else {
              console.log("Old image deleted:", oldFilename);
            }
          });
      

        }
      
        // Update the brand document
        const document = await brand.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
      
        if (!document) {
          return next(new ApiError(`No document for this id ${req.params.id}`, 404));
        }
      
        res.status(200).json({ data: document });
      });
      
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const existingBrand = await brand.findById(req.params.id);
  if (!existingBrand) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }


  // Delete image from disk if it exists
  if (existingBrand.image  ) {
    // Extract filename in case image is a full URL
    const filename = existingBrand.image.split("/brands/")[1];
    const imagePath = path.join(__dirname, "../uploads/brands", filename);
    
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err.message);
      } else {
        console.log("Image file deleted:", filename);
      }
    });
  }
    // Find and delete the brand
   const document = await  brand.findByIdAndDelete(id);
   if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  
  res.status(200).json({
    message: "brand deleted"
  }); // No Content
});

exports.getbrand = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      // 1) Build query
      const document= await  brand.findById(id);
  
      if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 404));
      }
      res.status(200).json({ data: document });
    })



exports.getBrands = asyncHandler(async (req, res) => {

    // Build query
    const documentsCounts = await brand.countDocuments();
    const apiFeatures = new ApiFeatures(brand.find(), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(brand)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
