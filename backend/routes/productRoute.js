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
  deleteProduct


} = require('../controller/product');

const{
  isSeller,isAdmin
}=require("../middleware/auth")



const router = express.Router();

router.route("/").get(

  getproducts
)

router.route("/create-product")
  .post(
    isSeller,
    isAdmin("Seller","admin"),
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
    isAdmin("Seller","admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    isSeller,
    isAdmin("Seller","admin"),
    deleteProductValidator,
    deleteProduct
  );

router
module.exports = router;
