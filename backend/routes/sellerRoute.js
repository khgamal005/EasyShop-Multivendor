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
    getSpecificSeller,
    updatePaymentMethods,
    deleteWithdrawMethod,
    updateAvatar


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
router.put('/update-avatar', isAuthenticated,isAdminOrSeller,uploadUserImage,
 updateAvatar);
router.get("/get-Specific-seller", getSpecificSeller);
router.put("/update-payment-methods",isAuthenticated,isAdminOrSeller, updatePaymentMethods);
router.put("/delete-withdraw-method",isAuthenticated,isAdminOrSeller, deleteWithdrawMethod);


// Admin

module.exports = router;
