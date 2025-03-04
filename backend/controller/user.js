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


exports.uploadUserImage = uploadSingleImage("avatar");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.avatar = filename;
  }

  next();
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const user = {
    name: name,
    email: email,
    password: password,
    avatar: {
      public_id: `user-${uuidv4()}-${Date.now()}`,
      url: avatar,
    },
  };

  // create activation token

  const activationToken = createActivationToken(user);

  const activationUrl = `http://localhost:5173/activation/${activationToken}`;

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
    const { name, email, password, avatar } = newUser;

    let user = await userModel.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
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
  const user = await userModel.findOne({ email: req.body.email }).select('+password');

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  delete user._doc.password;
  sendToken(user, 201, res);
});
