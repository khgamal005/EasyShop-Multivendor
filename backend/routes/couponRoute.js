const express = require('express');

const {
  getCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} = require('../controller/coupounCode');

const { isAuthenticated, isAdminOrSeller } = require("../middleware/auth");

const router = express.Router();

router
  .route("/create-coupon")
  .post(
    isAuthenticated,
    isAdminOrSeller,
    createCoupon
  );
 router.route('/get-coupon/:id').get(getCoupon);
 router.route('/:id').delete(
      isAuthenticated,
    isAdminOrSeller,
  deleteCoupon
);
 router.route('/').get(getAllCoupons);

module.exports = router;
