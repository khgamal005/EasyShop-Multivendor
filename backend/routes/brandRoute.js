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
  isSeller,isAdmin
}=require("../middleware/auth")


const router = express.Router();

router.route("/").get(
  isSeller,
  isAdmin("Seller","admin"),
  getBrands
)


router.route("/create-brand")
  .post(
    isSeller,
    isAdmin("Seller","admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route('/:id')
  .get(getBrandValidator, getbrand)
  .put(
    isSeller,
    isAdmin("Seller","admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    isSeller,
    isAdmin("Seller","admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
