import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsTrash, BsPencil } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  createReview,
  updateReview,
  deleteReview,
  fetchReviews,
} from "../../redux/slices/reviewSlice";
import Loader from "../Layout/Loader";

const ProductReviews = ({ productId, reviews, loading }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const userReview = reviews?.find((rev) => rev.user._id === user?._id);

  const handleSubmitReview = () => {
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return toast.error("Please select a rating between 1 and 5 stars");
    }

    if (!reviewText.trim()) {
      return toast.error("Please provide a review comment");
    }

    const payload = {
      product: productId,
      comment: reviewText,
      ratings: ratingValue,
    };

    if (editingReviewId) {
      dispatch(updateReview({ id: editingReviewId, data: payload }))
        .unwrap()
        .then(() => {
          setEditingReviewId(null);
          setReviewText("");
          setRatingValue(null);
          toast.success("Review updated successfully!");

        })
        .catch((error) => {
          toast.error(error.message || "Failed to update review");
        });
    } else {
      dispatch(createReview(payload))
        .unwrap()
        .then(() => {
          setReviewText("");
          setRatingValue(null);
          toast.success("Review submitted successfully!");
                  dispatch(fetchReviews(productId));  // REFRESH REVIEWS HERE

        })
        .catch((error) => {
          toast.error(error.message || "Failed to submit review");
        });
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setReviewText(review.comment);
    setRatingValue(review.ratings);
  };

  const handleDelete = (id) => {
    dispatch(deleteReview(id))
      .unwrap()
      .then(() => {
        toast.success("Review deleted");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to delete review");
      });
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

      {user && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {userReview ? "Edit your review" : "Write a review"}
          </h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className={`focus:outline-none ${
                    star <= (ratingValue || 0) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  aria-label={`Rate ${star} star`}
                >
                  <AiFillStar size={28} />
                </button>
              ))}
            </div>
            {!ratingValue && (
              <p className="mt-1 text-sm text-red-600">Please select a rating</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review *
            </label>
            <textarea
              className="w-full border rounded p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={4}
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleSubmitReview}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <Loader />
        ) : reviews?.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gray-100 p-4 rounded-md shadow-sm relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user.avatar?.url || "/images/user.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{review.user.name}</h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) =>
                        star <= review.ratings ? (
                          <AiFillStar key={star} size={18} color="#f6b100" />
                        ) : (
                          <AiOutlineStar key={star} size={18} color="#f6b100" />
                        )
                      )}
                    </div>
                  </div>
                </div>

                {user?._id === review.user._id && (
                  <div className="flex items-center gap-2">
                    <BsPencil
                      size={18}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      title="Edit"
                      onClick={() => handleEdit(review)}
                    />
                    <BsTrash
                      size={18}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      title="Delete"
                      onClick={() => handleDelete(review._id)}
                    />
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-800">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;