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
  getallproductsofshop,
  


} = require('../controller/product');

const{
 isAdminOrSeller,isAuthenticated
}=require("../middleware/auth")



const router = express.Router();

router.route("/").get(

  getproducts
)

router.route("/create-product")
  .post(
    isAuthenticated,
    isAdminOrSeller,
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    createProduct
  );

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    isAuthenticated,
    isAdminOrSeller,
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    isAuthenticated,               // Authenticate and attach req.user or req.seller
    isAdminOrSeller, // Admin or Seller check
    deleteProductValidator,        // Validate product ownership
    deleteProduct    
  );

  router.route("/get-all-products-shop/:id").get(getallproductsofshop)


router
module.exports = router;