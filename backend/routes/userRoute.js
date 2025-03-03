const express = require('express');

const {
    createUserValidator

}

=require('../utils/validators/userValidator');

const {
    createUser,
    uploadUserImage,
    resizeImage,
    activeUser


}= require("../controller/user")


const router = express.Router();

router.post("/signup",uploadUserImage, resizeImage, createUserValidator, createUser);

router.get("/activation/:token", activeUser); 
  

// Admin

module.exports = router;
