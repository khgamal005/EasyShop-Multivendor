const express = require('express');

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
} = require('../controller/category')

// const subcategoriesRoute = require('./subCategoryRoute');

const{
    isSeller,isAdmin
  }=require("../middleware/auth")

const router = express.Router();

// router.use('/:categoryId/subcategories', subcategoriesRoute);

router
router.route("/").get(
  isSeller,
  isAdmin("Seller","admin"),
  getCategories
)


router.route("/create-category")
  .post(
    isSeller,
    isAdmin("Seller","admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    isSeller,
    isAdmin("Seller","admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    isSeller,
    isAdmin("Seller","admin"),
    deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
