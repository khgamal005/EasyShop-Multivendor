const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const couponModel = require("../../model/couponModel");

exports.deleteCouponeValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      const Coupone = await couponModel.findById(val);
      if (!Coupone) {
        return Promise.reject(new Error('No Coupone found with this id'));
      }

       // Admin can delete any Coupone
       if (req.role === 'admin') {
        req.Coupone = Coupone; // Attach Coupone to req for controller
        return true;
      }

      // Seller can only delete their own Coupones
      if (req.role === 'Seller' && Coupone.shopId._id.toString() !== req.seller.id.toString()) {
        return Promise.reject(new Error('You are not allowed to delete this Coupone'));
      }

      req.Coupone = Coupone; // Attach product to req for controller
      return true;
    }),
  validatorMiddleware,
];