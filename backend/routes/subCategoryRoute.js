const express = require("express");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const {
  createSubCategory,
  getsubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../controller/subcategory");


const { isSeller, isAdmin } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(createFilterObj, getSubCategories);

router
  .route("/create-subCategory")
  .post(
    isSeller,
    isAdmin("Seller", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValidator, getsubCategory)
  .put(
    isSeller,
    isAdmin("Seller", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    isSeller,
    isAdmin("Seller", "admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
