const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const userModel = require("../model/userModel");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const ApiError = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const {
  saveTempAvatar,
  getTempAvatar,
  deleteTempAvatar,
} = require("../utils/tempImageStore");

exports.uploadUserImage = uploadSingleImage("avatar");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password ,address,phoneNumber,zipCode} = req.body;
  console.log(req.body)
  const avatarBuffer = req.file?.buffer;
  const tempAvatarId = avatarBuffer ? saveTempAvatar(avatarBuffer) : null;
  const user = {
    name,
    email,
    password,
    tempAvatarId,
    address,
    phoneNumber,
    zipCode,
  };

  // create activation token

  const activationToken = createActivationToken(user);

  const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `please check your email:- ${user.email} to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "10m",
  });
};

exports.activeUser = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.params;

    const newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      return next(new ("Invalid token", 400));
    }
    const { name, email, password, tempAvatarId,address,phoneNumber,zipCode } = newUser;

    let user = await userModel.findOne({ email });

    if (user) {
      return next(new ("User already exists", 400));
    }

    let avatar = null;
    if (tempAvatarId) {
      const avatarBuffer = getTempAvatar(tempAvatarId);
      if (avatarBuffer) {
        const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

        await sharp(avatarBuffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/users/${filename}`);

        avatar = {
          public_id: filename,
          url: filename,
        };

        deleteTempAvatar(tempAvatarId);
      }
    }

    user = await userModel.create({
      name,
      email,
      avatar,
      password,
      zipCode,
      address,phoneNumber
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new (error.message, 500));
  }
});

// login user

exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password");

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ("Incorrect email or password", 401));
  }

  delete user._doc.password;
  sendToken(user, 201, res);
});

// load user
exports.getuser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
    const user = await userModel.findById(id);
  

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
// load user
exports.loaduser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
    const user = await userModel.findById(id);
  

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// log out user
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
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



// Define which fields are allowed to be updated
const ALLOWED_FIELDS = ["name", "email", "phoneNumber", "address"];

// Delete a file if it exists
const deleteFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting old image:", err.message);
      else console.log("Old image deleted:", path.basename(filePath));
    });
  } else {
    console.warn("Old image not found:", filePath);
  }
};

exports.updateUserInfo = asyncHandler(async (req, res, next) => {
  const user = req.user
  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  // Handle avatar update
  if (req.file) {
    // Delete old avatar if it exists
    if (user.avatar?.url) {
      const oldFilename = path.basename(user.avatar.url);
      const oldImagePath = path.join(__dirname, "../uploads/users", oldFilename);
      deleteFileIfExists(oldImagePath);
    }

    // Process and save new avatar
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    const outputPath = path.join(__dirname, "../uploads/users", filename);

    await sharp(req.file.buffer)
      .resize(600, 600, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255 }, // Optional white background
      })
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(outputPath);

    user.avatar = {
      public_id: filename,
      url: filename, // Change to full URL if needed: `${process.env.BACKEND_URL}/users/${filename}`
    };
  }

  // Update allowed fields from req.body
  ALLOWED_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  // Save changes
  const updatedUser = await user.save();

  res.status(200).json({ data: updatedUser });
});

// update user info



// update-avatar


////add address

// exports.addAddress = asyncHandler(async (req, res, next) => {
//   const user = await userModel.findById(req.user.id);
//   if (!user) return next(new ApiError("User not found", 404));

//   user.addresses.push(req.body); // push new address to array
//   await user.save();

//   res.status(201).json({ message: "Address added", addresses: user.addresses });
// });

exports.addAddress = asyncHandler(async (req, res, next) => {
  const result = await userModel.updateOne(
    { _id: req.user.id },
    { $push: { addresses: req.body } }
  );

  if (result.modifiedCount === 0) {
    return next(new ApiError("Failed to add address", 400));
  }

  res.status(201).json({ message: "Address added successfully" });
});


//update address
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Find the index of the address to update
  const addressIndex = user.addresses.findIndex(
    (address) => address._id.toString() === addressId
  );

  if (addressIndex === -1) {
    return next(new ApiError("Address not found", 404));
  }

  // Update address fields
  user.addresses[addressIndex] = {
    ...user.addresses[addressIndex]._doc, // preserve existing fields
    ...req.body, // apply updates
  };

  await user.save();

  res.status(200).json({
    message: "Address updated successfully",
    addresses: user.addresses,
  });
});

//delete address

// exports.deleteAddress = asyncHandler(async (req, res, next) => {
//   const user = await userModel.findById(req.user.id);
//   if (!user) return next(new ApiError("User not found", 404));

//   user.addresses = user.addresses.filter(
//     (addr) => addr._id.toString() !== req.params.addressId
//   );

//   await user.save();

//   res.status(200).json({ message: "Address deleted", addresses: user.addresses });
// });

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;

  const result = await userModel.updateOne(
    { _id: req.user.id },
    { $pull: { addresses: { _id: addressId } } }
  );

  if (result.modifiedCount === 0) {
    return next(new ApiError("Address not found or already deleted", 404));
  }

  res.status(200).json({ message: "Address deleted successfully" });
});


// @desc    Deactivate logged user
// @route   DELETE /api/v1/user/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});


  exports.adminallusers=asyncHandler(async (req, res, next) => {

      const users = await userModel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    })
    
    exports.deleteuser = asyncHandler(async (req, res, next) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return next(new ApiError(`No document for this user ${req.user.id}`, 404));
      }
    
      // If there is a new file uploaded
     
        // Delete the old image from disk
        if (user.avatar?.url) {
          const oldFilename = user.avatar.url.split("/users/")[1];
          const oldImagePath = path.join(__dirname, "../uploads/users", oldFilename);
    
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting old image:", err.message);
            } else {
              console.log("Old image deleted:", oldFilename);
            }
          });
        }
    

      
  // Delete the product from DB
  const document = await userModel.findByIdAndDelete(req.params.id);
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({
    message: "user deleted successfully",
  });
});

  
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(
    req.body.oldPassword
  );

  if (!isPasswordMatched) {
    return next(new ("Old password is incorrect!", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ("Password doesn't matched with each other!", 400)
    );
  }
  user.password = req.body.newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully!",
  });
});

// // @desc    Forgot password
// // @route   POST /api/v1/auth/forgotPassword
// // @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Find the user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`There is no user with email ${req.body.email}`, 404));
  }

  // 2) Reset any previous tries or block status
  user.passwordResetTries = 0;
  user.isBlockedFromReset = false;

  // 3) Generate a new OTP
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");


  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires in 10 mins
  user.passwordResetVerified = false;

  await user.save();

  // 4) Send the OTP code via email
  const message = `Hi ${user.name},\nWe received a request to reset the password.\nYour reset code: ${resetCode}\nValid for 10 minutes.`;
  
  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset code",
      message,
    });

    res.status(200).json({ status: "Success", message: "Reset code sent to email" });
  } catch (err) {
    // Rollback in case of email failure
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error sending the email", 500));
  }
});


// // @desc    Verify password reset code
// // @route   POST /api/v1/auth/verifyResetCode
// // @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");


  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }
    // Bonus: If OTP expired, auto-block
    if (user.passwordResetExpires < Date.now()) {
      user.isBlockedFromReset = true;
      await user.save();
      return next(new ApiError("Reset code expired. Please request a new one.", 400));
    }
  if (user.isBlockedFromReset) {
    return next(new ApiError("You have been blocked from resetting password. Please request a new code.", 400));
  }

  if (hashedResetCode !== user.passwordResetCode) {
    user.passwordResetTries += 1;

    // If tries exceed 5, block the user
    if (user.passwordResetTries >= 5) {
      user.isBlockedFromReset = true;
    }

    await user.save();
    return next(new ApiError("Invalid reset code", 400));
  }
  // 2) Reset code valid
  user.passwordResetVerified = true;
  user.passwordResetTries = 0; // reset tries
  user.isBlockedFromReset = false;
  await user.save();

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
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  res.status(200).json({
    status: "Success",
    message: "password updated successfully",
  });
});


