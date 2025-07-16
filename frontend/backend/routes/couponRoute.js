const express = require('express');

const{
  deleteCouponeValidator
}=require("../utils/validators/couponeValidator")

const {
  getCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
  applyCoupon,getCouponValue
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
    deleteCouponeValidator,
  deleteCoupon
);
 router.route('/').get(getAllCoupons);
 router.route('/seller/:id').get(getAllCoupons);
 router.post("/apply", applyCoupon);
 router.get("/get-coupon-value/:name", getCouponValue);


module.exports = router;
