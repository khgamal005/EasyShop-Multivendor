const multer = require('multer');
const ApiError = require('../utils/ErrorHandler');

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  });

  return upload;
};



exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
