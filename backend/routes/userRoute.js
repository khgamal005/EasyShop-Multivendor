const express = require('express');

const {
    createUserValidator,
    loginValidator
}

=require('../utils/validators/userValidator');

const {
    createUser,
    uploadUserImage,
    activeUser,
    login


}= require("../controller/user")


const router = express.Router();

router.post("/signup",uploadUserImage, createUserValidator, createUser);
// router.post("/signup", createUser);
router.get("/activation/:token", activeUser); 
router.post('/login', loginValidator, login);
  

// Admin

module.exports = router;
