<<<<<<< HEAD
const { check,body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
=======

const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Brand = require('../../model/brand');
>>>>>>> origin/main

exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];

<<<<<<< HEAD
exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand required')
    .isLength({ max: 32 })
    .withMessage('Too long Brand name'),
  validatorMiddleware,
=======

  
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
>>>>>>> origin/main
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  body('name')
<<<<<<< HEAD
    .optional()
    ,
=======
    .optional(),
>>>>>>> origin/main
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];
