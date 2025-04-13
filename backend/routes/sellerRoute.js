const express = require('express');

const {
    createUserValidator,
    loginValidator,
    getUserValidator
}

=require('../utils/validators/userValidator');

const {
    createSeller,
    uploadUserImage,
    activeSeller,
    loginSeller,
    logoutSeller,
    getSeller


}= require("../controller/shop")

const{
    isSeller
}=require("../middleware/auth")

const router = express.Router();

router.post("/create-shop",uploadUserImage, createSeller);
router.get("/activation/:token", activeSeller); 
router.post('/login-shop', loginValidator, loginSeller);
router.get('/getSeller',isSeller, getSeller);
router.get('/logoutSeller', logoutSeller);
  

// Admin

module.exports = router;
