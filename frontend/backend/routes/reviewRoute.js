const express = require('express');

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require('../controller/review');

const{
  isAuthenticated,isAdmin
}=require("../middleware/auth")

const router = express.Router({ mergeParams: true });



router
  .route('/')
  .get(createFilterObj, getReviews)
  .post(
    isAuthenticated,
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(
    isAuthenticated,
    setProductIdAndUserIdToBody,
    updateReviewValidator,
    updateReview
  )
  .delete(
    isAuthenticated,
    isAdmin('user', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
