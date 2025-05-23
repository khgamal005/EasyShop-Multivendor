const express = require('express');

const {
    createUserValidator,
    loginValidator,
    getUserValidator,
    updateSellerValidator
}

=require('../utils/validators/userValidator');
const{
 isAdminOrSeller,isAuthenticated
}=require("../middleware/auth")

const {
    createSeller,
    uploadUserImage,
    activeSeller,
    loginSeller,
    logoutSeller,
    getSeller,
    editSellerInfo,
    getSpecificSeller


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
router.put('/update-seller', isAuthenticated,isAdminOrSeller,uploadUserImage,
 editSellerInfo);
router.get("/get-Specific-seller", getSpecificSeller);


// Admin

module.exports = router;
