<<<<<<< HEAD
const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');

exports.createProductValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
=======
const { check } = require("express-validator");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../model/category");
const SubCategory = require("../../model/subCategory");
const Product = require("../../model/product");

exports.createProductValidator = [
  check("name")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("Product required"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("stock")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold_out")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("originalPrice")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("discountPrice")
    .optional()
    .isNumeric()
    .withMessage("Product discountPrice must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.originalPrice <= value) {
        throw new Error("discountPrice must be lower than price");
>>>>>>> origin/main
      }
      return true;
    }),

<<<<<<< HEAD
  check('colors')
    .optional()
    .isArray()
    .withMessage('availableColors should be array of string'),
  check('imageCover').notEmpty().withMessage('Product imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),
  check('category')
    .notEmpty()
    .withMessage('Product must be belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(async (categoryId) =>{
      
      const categoryIds = await Category.findById(categoryId)
      if(!categoryIds){
        throw new Error(`No category for this id: ${categoryId}`)
      }
    }
    )
    ,

  check('subcategories')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
=======
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

  check("subcategories")
    .optional()
    .customSanitizer((value) => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    })
    .isArray()
    .withMessage("Subcategories must be an array of MongoDB IDs")
    .custom((arr) => {
      const isValid = arr.every((id) => /^[0-9a-fA-F]{24}$/.test(id));
      if (!isValid) {
        throw new Error(
          "One or more subcategory IDs are not valid MongoDB ObjectIds"
        );
      }
      return true;
    })
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $in: subcategoriesIds } }).then((result) => {
        if (result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories Ids`));
        }
      })
>>>>>>> origin/main
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
<<<<<<< HEAD
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
=======
          const subCategoriesIdsInDB = subcategories.map((sub) =>
            sub._id.toString()
          );
          const allBelong = val.every((v) => subCategoriesIdsInDB.includes(v));
          if (!allBelong) {
            return Promise.reject(
              new Error(`Subcategories do not belong to the selected category`)
>>>>>>> origin/main
            );
          }
        }
      )
    ),

<<<<<<< HEAD
  check('brand').optional().isMongoId().withMessage('Invalid ID formate'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),
=======
  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
>>>>>>> origin/main

  validatorMiddleware,
];

exports.getProductValidator = [
<<<<<<< HEAD
  check('id').isMongoId().withMessage('Invalid ID formate'),
=======
  check("id").isMongoId().withMessage("Invalid ID formate"),
>>>>>>> origin/main
  validatorMiddleware,
];

exports.updateProductValidator = [
<<<<<<< HEAD
  check('id').isMongoId().withMessage('Invalid ID formate'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
=======
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);

      if (!product) {
        return Promise.reject(new Error('No product found with this id'));
      }

    // Admin can delete any product
    if (req.role === 'admin') {
      req.product = product; // Attach product to req for controller
      return true;
    }
  

    // Seller can only delete their own products
    if (req.role === 'Seller' && product.shop._id.toString() !== req.seller.id.toString()) {
      return Promise.reject(new Error('You are not allowed to edit this product'));
    }
   

    req.product = product; // Attach product to req for controller
    return true;
    }),

  // Fields Validations
  check("name")
    .isLength({ min: 2 })
    .optional()
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("Product required"),
  check("description")
    .notEmpty()
    .optional()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("stock")
    .optional()
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold_out")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("originalPrice")
    .optional()
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("discountPrice")
    .optional()
    .isNumeric()
    .withMessage("Product discountPrice must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
    check("images")
    .optional()
    .custom((value) => {
      // Accept either:
      // 1. An array of strings
      // 2. A single string
      // 3. Undefined/null (handled by .optional())
      if (value === undefined || value === null) return true;
      if (typeof value === 'string') return true;
      if (Array.isArray(value)) {
        return value.every(item => typeof item === 'string');
      }
      return false;
    })
    .withMessage("Images must be either a string or an array of strings"),
  
  check("category")
    .optional()
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

  check("subcategories")
    .optional()
    .customSanitizer((value) => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    })
    .isArray()
    .withMessage("Subcategories must be an array of MongoDB IDs")
    .custom((arr) => {
      const isValid = arr.every((id) => /^[0-9a-fA-F]{24}$/.test(id));
      if (!isValid) {
        throw new Error(
          "One or more subcategory IDs are not valid MongoDB ObjectIds"
        );
      }
      return true;
    })
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $in: subcategoriesIds } }).then((result) => {
        if (result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories Ids`));
        }
      })
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = subcategories.map((sub) =>
            sub._id.toString()
          );
          const allBelong = val.every((v) => subCategoriesIdsInDB.includes(v));
          if (!allBelong) {
            return Promise.reject(
              new Error(`Subcategories do not belong to the selected category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];



exports.deleteProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        return Promise.reject(new Error('No product found with this id'));
      }

       // Admin can delete any product
       if (req.role === 'admin') {
        req.product = product; // Attach product to req for controller
        return true;
      }

      // Seller can only delete their own products
      if (req.role === 'Seller' && product.shop._id.toString() !== req.seller.id.toString()) {
        return Promise.reject(new Error('You are not allowed to delete this product'));
      }

      req.product = product; // Attach product to req for controller
      return true;
    }),
  validatorMiddleware,
];
>>>>>>> origin/main
