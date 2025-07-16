const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const Shop = require("../model/shop");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const path = require("path");
const {
  saveTempAvatar,
  getTempAvatar,
  deleteTempAvatar,
} = require("../utils/tempImageStore");
const sendShopToken = require("../utils/shopToken");

exports.uploadUserImage = uploadSingleImage("avatar");



// create shop
exports.createSeller = asyncHandler(async (req, res, next) => {
  const { name, email, password, address, phoneNumber, zipCode } = req.body;
  const avatarBuffer = req.file?.buffer;
  const tempAvatarId = avatarBuffer ? saveTempAvatar(avatarBuffer) : null;
  const seller = {
    name,
    email,
    password,
    tempAvatarId,
    address,
    phoneNumber,
    zipCode,
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
    const {
      name,
      email,
      password,
      zipCode,
      address,
      phoneNumber,
      tempAvatarId,
    } = newSeller;

    let seller = await Shop.findOne({ email });

    if (seller) {
      return next(new ErrorHandler("seller already exists", 400));
    }
    let avatar = null;
    if (tempAvatarId) {
      const avatarBuffer = getTempAvatar(tempAvatarId);
      if (avatarBuffer) {
        const filename = `seller-${uuidv4()}-${Date.now()}.jpeg`;

        await sharp(avatarBuffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/sellers/${filename}`);

        avatar = {
          public_id: filename,
          url: filename,
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
});

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
});

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

exports.editSellerInfo = asyncHandler(async (req, res, next) => {
  const seller = await Shop.findById(req.seller.id);
  if (!seller) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

if (req.file) {
  // Delete old avatar if new one is sent
if (req.file && seller?.avatar?.url) {
  const oldFilename = path.basename(seller.avatar.url);
  const oldImagePath = path.join(__dirname, "../uploads/sellers", oldFilename);

  if (fs.existsSync(oldImagePath)) {
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Error deleting old image:", err.message);
      else console.log("Old image deleted:", oldFilename);
    });
  } else {
    console.warn("Old image file not found:", oldImagePath);
  }
}
}

  const updates = {
    ...req.body,
  };

  if (req.file) {
    const avatarBuffer = req.file?.buffer;

    const filename = `seller-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(avatarBuffer)
      .resize(600, 600, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255 }, // optional white background padding
      })
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/sellers/${filename}`);

    avatar = {
      public_id: filename,
      url: filename,
    };
    updates.avatar = avatar;
  }

  // Update seller info
  const updatedSeller = await Shop.findByIdAndUpdate(req.seller.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedSeller) {
    return next(
      new ErrorHandler(`No seller found with id ${req.seller.id}`, 404)
    );
  }

  res.status(200).json({ data: updatedSeller });
});

exports.updateAvatar = asyncHandler(async (req, res, next) => {
  const seller = await Shop.findById(req.user.id);
  if (!seller) {
    return next(new ApiError(`No document for this user ${req.seller.id}`, 404));
  }

  // If there is a new file uploaded
  if (req.file) {
    // Delete the old image from disk
    if (seller.avatar && seller.avatar.url) {
      const oldFilename = seller.avatar.url.split("/sellers/")[1];
      const oldImagePath = path.join(__dirname, "../uploads/sellers", oldFilename);

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err.message);
        } else {
          console.log("Old image deleted:", oldFilename);
        }
      });
    }

    // Process new avatar
    const avatarBuffer = req.file.buffer;
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(avatarBuffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/sellers/${filename}`);

    const avatar = {
      public_id: filename,
      url: `${process.env.BACKEND_URL}/sellers/${filename}`,
    };

    // Update the user avatar field
    seller.avatar = avatar;
  }

  // Apply other updates if any
  Object.assign(seller, req.body);

  // Save updated user
  const updatedshop = await Shop.save();

  res.status(200).json({ data: updatedshop });
});

exports.getSpecificSeller = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const seller = await Shop.findById(id);

  if (!seller) {
    return next(new ErrorHandler("Seller doesn't exist", 400));
  }

  res.status(200).json({
    success: true,
    seller,
  });
});

// update-avatar


// update seller withdraw methods --- sellers
exports.updatePaymentMethods =asyncHandler(async (req, res, next) => {

      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } )


// // delete seller withdraw merthods --- only seller


  exports.deleteWithdrawMethod=asyncHandler(async (req, res, next) => {

      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    
  })

  exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Find the user by email
    const seller = await Shop.findOne({ email: req.body.email });
    if (!seller) {
      return next(new ApiError(`There is no seller with email ${req.body.email}`, 404));
    }
  
    // 2) Reset any previous tries or block status
    seller.passwordResetTries = 0;
    seller.isBlockedFromReset = false;
  
    // 3) Generate a new OTP
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");
  
  
    seller.passwordResetCode = hashedResetCode;
    seller.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires in 10 mins
    seller.passwordResetVerified = false;
  
    await seller.save();
  
    // 4) Send the OTP code via email
    const message = `Hi ${Shop.name},\nWe received a request to reset the password.\nYour reset code: ${resetCode}\nValid for 10 minutes.`;
    
    try {
      await sendMail({
        email: seller.email,
        subject: "Your password reset code",
        message,
      });
  
      res.status(200).json({ status: "Success", message: "Reset code sent to email" });
    } catch (err) {
      // Rollback in case of email failure
      seller.passwordResetCode = undefined;
      seller.passwordResetExpires = undefined;
      seller.passwordResetVerified = undefined;
      await seller.save();
      return next(new ErrorHandler("There is an error sending the email", 500));
    }
  });
  
  
  // // @desc    Verify password reset code
  // // @route   POST /api/v1/auth/verifyResetCode
  // // @access  Public
  exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    // 1) Get user based on reset code
    const hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");
  
  
    const seller = await Shop.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!seller) {
      return next(new ErrorHandler("Reset code invalid or expired"));
    }
      // Bonus: If OTP expired, auto-block
      if (seller.passwordResetExpires < Date.now()) {
        seller.isBlockedFromReset = true;
        await Shop.save();
        return next(new ErrorHandler("Reset code expired. Please request a new one.", 400));
      }
    if (seller.isBlockedFromReset) {
      return next(new ErrorHandler("You have been blocked from resetting password. Please request a new code.", 400));
    }
  
    if (hashedResetCode !== seller.passwordResetCode) {
      seller.passwordResetTries += 1;
  
      // If tries exceed 5, block the user
      if (seller.passwordResetTries >= 5) {
        seller.isBlockedFromReset = true;
      }
  
      await seller.save();
      return next(new ApiError("Invalid reset code", 400));
    }
    // 2) Reset code valid
    seller.passwordResetVerified = true;
    seller.passwordResetTries = 0; // reset tries
    seller.isBlockedFromReset = false;
    await seller.save();
  
    res.status(200).json({
      status: "Success",
      message: "Reset code verified successfully",
    });
  });
  
  // // @desc    Reset password
  // // @route   POST /api/v1/auth/resetPassword
  // // @access  Public
  exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user based on email
    const seller = await Shop.findOne({ email: req.body.email });
    if (!seller) {
      return next(
        new ErrorHandler(`There is no seller with email ${req.body.email}`, 404)
      );
    }
  
    // 2) Check if reset code verified
    if (!seller.passwordResetVerified) {
      return next(new ErrorHandler("Reset code not verified", 400));
    }
  
    seller.password = req.body.newPassword;
    seller.passwordResetCode = undefined;
    seller.passwordResetExpires = undefined;
    seller.passwordResetVerified = undefined;
  
    await seller.save();
  
    // 3) if everything is ok, generate token
    res.status(200).json({
      status: "Success",
      message: "password updated successfully",
    });
  });