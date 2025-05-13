const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../model/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password").notEmpty().withMessage("Password required"),

  validatorMiddleware,
];

exports.updateUserInfoValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),

    validatorMiddleware
];


exports.updateAvatarValidator = [
  check("avatar")
    .optional()
    .custom((value, { req }) => {
      if (req.file && !req.file.mimetype.startsWith("image/")) {
        throw new Error("Only image files are allowed.");
      }
      return true;
    }),
  validatorMiddleware,
];

// Add Address Validator
exports.addAddressValidator = [
  check("country").notEmpty().withMessage("Country is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("address1").notEmpty().withMessage("Address1 is required"),
  check("zipCode").isNumeric().withMessage("Zip code must be a number"),
  check("addressType")
    .notEmpty()
    .withMessage("Address type is required")
    .isIn(["Home", "Work", "Other"])
    .withMessage("Address type must be Home, Work, or Other"),
  validatorMiddleware,
];

// Update Address Validator
exports.updateAddressValidator = [
  param("addressId")
    .isMongoId()
    .withMessage("Invalid address ID"),
  check("country").optional().notEmpty().withMessage("Country cannot be empty"),
  check("city").optional().notEmpty().withMessage("City cannot be empty"),
  check("address1").optional().notEmpty().withMessage("Address1 cannot be empty"),
  check("zipCode").optional().isNumeric().withMessage("Zip code must be a number"),
  check("addressType")
    .optional()
    .isIn(["Home", "Work", "Other"])
    .withMessage("Address type must be Home, Work, or Other"),
  validatorMiddleware,
];

// Delete Address Validator
exports.deleteAddressValidator = [
  param("addressId")
    .isMongoId()
    .withMessage("Invalid address ID"),
  validatorMiddleware,
];


exports.validateDeleteUser = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isLength({ min: 4 })
    .withMessage("Old password must be at least 4 characters"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 5 })
    .withMessage("New password must be at least 6 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),

  validatorMiddleware,
];

exports.updateSellerValidator = [
  check('id').isMongoId().withMessage('Invalid seller id format')
  .custom((value, { req }) => {
      // Check if seller is authenticated and trying to update their own profile
      if (req.role !== "seller" || !req.seller || req.seller._id.toString() !== value) {
        throw new Error("You are not authorized to update this seller profile");
      }
      return true;
    }),
  validatorMiddleware,
];

