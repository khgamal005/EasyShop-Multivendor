const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/category");

const subcategoriesRoute = require("./subCategoryRoute");

const { isAdminOrSeller, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);

router.route("/").get(getCategories);

router
  .route("/create-category")
  .post(
    isAuthenticated,
    isAdminOrSeller,
    uploadCategoryImage,
    createCategoryValidator,
    resizeImage,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    isAuthenticated,
    isAdminOrSeller,
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    isAuthenticated,
    isAdminOrSeller,
    deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
