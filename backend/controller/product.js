const asyncHandler = require("../middleware/catchAsyncErrors");
const Product = require("../model/product");
// const Order = require("../model/order");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ApiFeatures = require("../utils/apiFeatures");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "images",
    maxCount: 7,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255 }, // optional white background padding
          })
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// create product
exports.createProduct = asyncHandler(async (req, res, next) => {
  const shopId = req.body.shopId;
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return next(new ErrorHandler("Shop Id is invalid!", 400));
  } else {
    const newDoc = await Product.create(req.body);
    res.status(201).json({ message: "productcreated", data: newDoc });
  }
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // 1) Build query
  const document = await Product.findById(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});



exports.getproducts = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
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


exports.updateProduct = asyncHandler(async (req, res, next) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  // If new images are provided, check which old images need to be deleted
  if (req.body.images && Array.isArray(req.body.images) && existingProduct.images) {
    const oldImages = existingProduct.images;
    const newImages = req.body.images;

    // Images to delete = ones that existed before but not in the updated list
    const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

    imagesToDelete.forEach((img) => {
      const filename = img.split("/products/")[1]; // adjust folder name if needed
      const imagePath = path.join(__dirname, "../uploads/products", img);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err.message);
        } else {
          console.log("Deleted old image:", filename);
        }
      });
    });
  }

  // Update the product with new data
  const document = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  // Delete images from disk (if filenames are stored directly)
  if (Array.isArray(existingProduct.images)) {
    existingProduct.images.forEach((filename) => {
      const imagePath = path.join(__dirname, "../uploads/products", filename);

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
  const document = await Product.findByIdAndDelete(req.params.id);
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({
    message: "Product deleted successfully",
  });
});



// get all products of a shop
// router.get(
//   "/get-all-products-shop/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const products = await Product.find({ shopId: req.params.id });

//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // delete product of a shop
// router.delete(
//   "/delete-shop-product/:id",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const product = await Product.findById(req.params.id);

//       if (!product) {
//         return next(new ErrorHandler("Product is not found with this id", 404));
//       }

//       for (let i = 0; 1 < product.images.length; i++) {
//         const result = await cloudinary.v2.uploader.destroy(
//           product.images[i].public_id
//         );
//       }

//       await product.remove();

//       res.status(201).json({
//         success: true,
//         message: "Product Deleted successfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // get all products
// router.get(
//   "/get-all-products",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const products = await Product.find().sort({ createdAt: -1 });

//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // review for a product
// router.put(
//   "/create-new-review",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { user, rating, comment, productId, orderId } = req.body;

//       const product = await Product.findById(productId);

//       const review = {
//         user,
//         rating,
//         comment,
//         productId,
//       };

//       const isReviewed = product.reviews.find(
//         (rev) => rev.user._id === req.user._id
//       );

//       if (isReviewed) {
//         product.reviews.forEach((rev) => {
//           if (rev.user._id === req.user._id) {
//             (rev.rating = rating), (rev.comment = comment), (rev.user = user);
//           }
//         });
//       } else {
//         product.reviews.push(review);
//       }

//       let avg = 0;

//       product.reviews.forEach((rev) => {
//         avg += rev.rating;
//       });

//       product.ratings = avg / product.reviews.length;

//       await product.save({ validateBeforeSave: false });

//       await Order.findByIdAndUpdate(
//         orderId,
//         { $set: { "cart.$[elem].isReviewed": true } },
//         { arrayFilters: [{ "elem._id": productId }], new: true }
//       );

//       res.status(200).json({
//         success: true,
//         message: "Reviwed succesfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // all products --- for admin
// router.get(
//   "/admin-all-products",
//   isAuthenticated,
//   isAdmin("Admin"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const products = await Product.find().sort({
//         createdAt: -1,
//       });
//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );
