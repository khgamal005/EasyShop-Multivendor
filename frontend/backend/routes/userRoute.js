const express = require('express');

const {
    createUserValidator,
    loginValidator,
    updateUserInfoValidator,
    updateAvatarValidator,
    addAddressValidator,
    updateAddressValidator,
    deleteAddressValidator,
    validateDeleteUser,
    changePasswordValidator
}

=require('../utils/validators/userValidator');

const {
    createUser,
    uploadUserImage,
    activeUser,
    login,
    getuser,
    logout,
    updateUserInfo,
    loaduser,
    updateAddress,
    addAddress,
    deleteAddress,
    deleteLoggedUserData,
    adminallusers,
    deleteuser,
    changeUserPassword,
    forgotPassword,
    verifyPassResetCode,
    resetPassword


}= require("../controller/user")

const{
    isAuthenticated,isAdmin
}=require("../middleware/auth")

const router = express.Router();

router.post("/signup",uploadUserImage, createUser);
// router.post("/signup", createUser);
router.get("/activation/:token", activeUser); 
router.post('/login', loginValidator, login);
router.get('/getuser/:id', getuser);
router.get('/loaduser',isAuthenticated, loaduser);
router.get('/logout', logout);
router.put("/update-user-info",isAuthenticated,uploadUserImage, updateUserInfo);
router.post("/update-user-address", isAuthenticated,addAddressValidator, addAddress);
router.put("/update-user-address/:addressId", isAuthenticated,updateAddressValidator, updateAddress);
router.delete("/delete-user-address/:addressId", isAuthenticated, deleteAddressValidator,deleteAddress);
router.put("/change-password", isAuthenticated,changeUserPassword);
router.delete('/deleteMe', isAuthenticated,deleteLoggedUserData);
router.get('/allusers', isAuthenticated,isAdmin("admin"),adminallusers);
router.delete('/deleteuser', isAuthenticated,isAdmin("admin"),validateDeleteUser,deleteuser);
router.post('/forgotPassword', forgotPassword);
 router.post('/verifyResetCode', verifyPassResetCode);
 router.post('/resetPassword', resetPassword);
  

// Admin

module.exports = router;
