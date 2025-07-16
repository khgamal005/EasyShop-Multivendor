const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const category = require('../../model/category');


exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check('name')
  .notEmpty()
  .withMessage('category name is required')
  .isLength({ min: 2 })
  .withMessage('category name must be at least 2 characters')
  .isLength({ max: 32 })
  .withMessage('category name must be less than 32 characters')
    .custom(async (val) => {
        const brand = await category.findOne({ name: val });
        if (brand) {
          throw new Error('category must be unique');
        }
        return true;
      }),
  

validatorMiddleware

];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];
