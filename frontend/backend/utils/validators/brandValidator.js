
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Brand = require('../../model/brand');

exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];


  
exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2 })
    .withMessage('Brand name must be at least 2 characters')
    .isLength({ max: 32 })
    .withMessage('Brand name must be less than 32 characters')
    .custom(async (val) => {
      const brand = await Brand.findOne({ name: val });
      if (brand) {
        throw new Error('Brand must be unique');
      }
      return true;
    }),

  validatorMiddleware // should be outside of the check() chain
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  body('name')
    .optional(),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];
