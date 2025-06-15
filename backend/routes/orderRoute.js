const express = require("express");
// const {

// } = require("../utils/validators/productValidator");

const {
  createOrder,
  updateOrderStatusOfSeller,
  orderRefund,
  orderRefundSuccess,
  getAllOrdersOfUser,
  getAllordersOfSeller,
  allOrdersForAdmin
} = require("../controller/order");

const { isAdminOrSeller, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/create-order").post( createOrder);

router
  .route("/get-all-orders/:userId")
  .get(isAuthenticated, getAllOrdersOfUser);

router
  .route("/get-seller-all-orders/:shopId")
  .get(isAuthenticated, getAllordersOfSeller);
router
  .route("/update-order-status/:id")
  .get(isAuthenticated, isAdminOrSeller, updateOrderStatusOfSeller);
router
  .route("/order-refund-success/:id")
  .get(isAuthenticated, isAdminOrSeller, orderRefundSuccess);
router
  .route("/admin-all-orders")
  .get(isAuthenticated, isAdminOrSeller, allOrdersForAdmin);
router.route("/order-refund/:id").get(isAuthenticated, orderRefund);


module.exports = router;
