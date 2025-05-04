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


const { isAuthenticated,isAdminOrSeller} = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(createFilterObj, getSubCategories);

router
  .route("/create-subCategory")
  .post(
    isAuthenticated,
    isAdminOrSeller,
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValidator, getsubCategory)
  .put(
    isAuthenticated,
    isAdminOrSeller,
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    isAuthenticated,
    isAdminOrSeller,
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
