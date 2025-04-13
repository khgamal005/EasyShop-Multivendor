const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const Shop = require("../model/shop");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const { saveTempAvatar, getTempAvatar, deleteTempAvatar } = require('../utils/tempImageStore');
const sendShopToken = require("../utils/shopToken");



exports.uploadUserImage = uploadSingleImage("avatar");

// create shop
exports.createSeller = asyncHandler(async (req, res, next) => {
  const { name, email, password, address ,phoneNumber ,zipCode } = req.body;
  const avatarBuffer = req.file?.buffer;
  const tempAvatarId = avatarBuffer ? saveTempAvatar(avatarBuffer) : null;
  const seller = {
    name,
    email,
    password,
    tempAvatarId,
    address,
    phoneNumber, 
    zipCode
  };

  // create activation token

  const activationToken = createActivationToken(seller);

  const activationUrl = `${process.env.FRONTEND_URL}/activation/seller/${activationToken}`;

  try {
    await sendMail({
      email: seller.email,
      subject: "Activate your account",
      message: `Hello ${seller.name}, please click on the link to activate your account: ${activationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `please check your email:- ${seller.email} to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate seller

exports.activeSeller = asyncHandler(async (req, res, next) => {
    try {
          const { token } = req.params;
      
          const newSeller = jwt.verify(token, process.env.ACTIVATION_SECRET);




      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, zipCode, address, phoneNumber,tempAvatarId } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("seller already exists", 400));
      }
      let avatar = null;
          if (tempAvatarId) {
            const avatarBuffer = getTempAvatar(tempAvatarId);
            if (avatarBuffer) {
              const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
      
              await sharp(avatarBuffer)
                .resize(600, 600)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(`uploads/sellers/${filename}`);
      
              avatar = {
                public_id: filename,
                url: `${process.env.BACKEND_URL}/seller/${filename}`,
              };
      
              deleteTempAvatar(tempAvatarId);
            }
          }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })


// login shop

exports.loginSeller = asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })

// log out from shop
exports.logoutSeller = asyncHandler(async (req, res, next) => {
  res.cookie("seller_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    success: true,
    message: "Log out successful!",
  });
});

exports.getSeller = asyncHandler(async (req, res, next) => {
  const seller = await Shop.findById(req.seller.id);

  if (!seller) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  res.status(200).json({
    success: true,
    seller,
  });
});

    


