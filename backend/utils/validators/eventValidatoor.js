const { body ,check} = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Event = require("../../model/event");


exports.eventValidator = [
  body('name')
    .notEmpty()
    .withMessage('Please enter your event product name!'),

  body('description')
    .notEmpty()
    .withMessage('Please enter your event product description!'),

  body('category')
    .notEmpty()
    .withMessage('Please enter your event product category!'),

  body('start_Date')
    .notEmpty()
    .withMessage('Please provide the event start date!')
    .isISO8601()
    .toDate(),

  body('Finish_Date')
    .notEmpty()
    .withMessage('Please provide the event finish date!')
    .isISO8601()
    .toDate(),

  body('discountPrice')
    .notEmpty()
    .withMessage('Please enter your event product price!')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),

  body('stock')
    .notEmpty()
    .withMessage('Please enter your event product stock!')
    .isInt({ gt: 0 })
    .withMessage('Stock must be a positive number'),

  body('originalPrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Original price must be greater than 0'),

  body('tags')
    .optional()
    .isString(),

  body('status')
    .optional()
    .isIn(['Running', 'Expired', 'Upcoming'])
    .withMessage('Invalid status value'),


    validatorMiddleware
];


exports.deleteEventValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      const event = await Event.findById(val);
      if (!event) {
        return Promise.reject(new Error('No event found with this id'));
      }

       // Admin can delete any event
       if (req.role === 'admin') {
        req.event = event; // Attach event to req for controller
        return true;
      }

      // Seller can only delete their own events
      if (req.role === 'Seller' && event.shopId.toString() !== req.seller.id.toString()) {
        return Promise.reject(new Error('You are not allowed to delete this event'));
      }

      req.event = event; // Attach event to req for controller
      return true;
    }),
  validatorMiddleware,
];