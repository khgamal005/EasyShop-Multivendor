const express = require('express');

const{
  isAuthenticated,
}=require("../middleware/auth")

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../controller/wishlist');

const router = express.Router();

router.use(isAuthenticated );

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;
