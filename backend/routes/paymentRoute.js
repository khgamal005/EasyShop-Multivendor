const express = require('express');

const {
  createPayment,
  stripeapikey

} = require('../controller/payment');

const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router
  .route("/process")
  .post(
    isAuthenticated,
    createPayment
  );
 router.route('/stripeapikey').get(stripeapikey);


module.exports = router;
