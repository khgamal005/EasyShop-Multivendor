const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const userModel = require("../model/userModel");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
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
  const { name, email, password, avatar } = req.body;
  const avatarBuffer = req.file?.buffer;
  const tempAvatarId = avatarBuffer ? saveTempAvatar(avatarBuffer) : null;
  const user = {
    name: name,
    email: email,
    password: password,
    tempAvatarId,
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
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { name, email, password, tempAvatarId } = newUser;

    let user = await userModel.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
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
          url: `${process.env.BACKEND_URL}/users/${filename}`,
        };

        deleteTempAvatar(tempAvatarId);
      }
    }

    user = await userModel.create({
      name,
      email,
      avatar,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// login user

exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password");

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  delete user._doc.password;
  sendToken(user, 201, res);
});

// load user
exports.getuser = asyncHandler(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
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

// update user info

exports.updateuserinfo = asyncHandler(async (req, res, next) => {
  const { email, password, phoneNumber, name } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return next(
      new ErrorHandler("Please provide the correct information", 400)
    );
  }

  user.name = name;
  user.email = email;
  user.phoneNumber = phoneNumber;

  await user.save();

  res.status(201).json({
    success: true,
    user,
  });
});
// update-avatar
exports.updateAvatar = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new ApiError(`No document for this user ${req.user.id}`, 404));
  }

  // If there is a new file uploaded
  if (req.file) {
    // Delete the old image from disk
    if (user.avatar && user.avatar.url) {
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

    // Process new avatar
    const avatarBuffer = req.file.buffer;
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(avatarBuffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    const avatar = {
      public_id: filename,
      url: `${process.env.BACKEND_URL}/users/${filename}`,
    };

    // Update the user avatar field
    user.avatar = avatar;
  }

  // Apply other updates if any
  Object.assign(user, req.body);

  // Save updated user
  const updatedUser = await user.save();

  res.status(200).json({ data: updatedUser });
});




// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode}
   \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
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
  sendToken(user, 201, res);
});
