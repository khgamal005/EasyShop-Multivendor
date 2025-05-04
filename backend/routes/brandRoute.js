const express = require('express');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brandValidator');

const {
  getBrands,
  getbrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require('../controller/brand');


const{
  isAuthenticated,
  isAdminOrSeller,
}=require("../middleware/auth")


const router = express.Router();

router.route("/").get(
    isAuthenticated,
    isAdminOrSeller,
  getBrands
)


router.route("/create-brand")
  .post(
    isAuthenticated,
    isAdminOrSeller,
    uploadBrandImage,
    createBrandValidator,
    resizeImage,
    createBrand
  );
router
  .route('/:id')
  .get(getBrandValidator, getbrand)
  .put(
    isAuthenticated,
    isAdminOrSeller,
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    isAuthenticated,
    isAdminOrSeller,
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
