const express = require('express');
const {
  getProductValidator,
  createProductValidator,
   updateProductValidator,
   deleteProductValidator,
} = require('../utils/validators/productValidator');

const {
 
  createProduct,
  uploadProductImages,
  resizeProductImages,
  getProduct,
  getproducts,
  updateProduct,
  deleteProduct,
  getallproductsofshop


} = require('../controller/product');

const{
  isSeller,isAdminOrSeller
}=require("../middleware/auth")



const router = express.Router();

router.route("/").get(

  getproducts
)

router.route("/create-product")
  .post(
    isSeller,
    isAdminOrSeller("Seller","admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    isSeller,
    isAdminOrSeller("Seller","admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    isSeller,
    isAdminOrSeller("Seller","admin"),
    deleteProductValidator,
    deleteProduct
  );

  router.route("/get-all-products-shop/:id").get(getallproductsofshop)

router
module.exports = router;
