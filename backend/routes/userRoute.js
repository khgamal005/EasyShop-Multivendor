const express = require('express');

const {
    createUserValidator,
    loginValidator,
    getUserValidator
}

=require('../utils/validators/userValidator');

const {
    createUser,
    uploadUserImage,
    activeUser,
    login,
    getuser,
    logout,


}= require("../controller/user")

const{
    isAuthenticated
}=require("../middleware/auth")

const router = express.Router();

router.post("/signup",uploadUserImage, createUserValidator, createUser);
// router.post("/signup", createUser);
router.get("/activation/:token", activeUser); 
router.post('/login', loginValidator, login);
router.get('/getuser',isAuthenticated, getuser);
router.get('/logout', logout);
  

// Admin

module.exports = router;
