const express=require('express')
const { register, login, logout, updateUserPassword, updateUserInfo, deleteUser, requestPasswordReset, resetPassword, getUserById, findByName, sendfriendRequest, acceptFriendRequest } = require('../Controllers/UserController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = require('./PostRoutes');

const routes=express.Router()


routes.post('/register',register);
routes.post('/login',login );
routes.get("/profile",authenticateToken,(req,res)=>{
    res.json({
        message: "Welcome to your Profile",
        user: req.user

    });
});
routes.post("/logout",logout);
routes.post("/request-reset-password",requestPasswordReset);
routes.post("/reset-password/:token",resetPassword);
routes.put("/update/:id",updateUserPassword)
routes.put("/updateInfo/:id",updateUserInfo)
routes.delete("/deleteUser/:id",deleteUser)
routes.get("/getUser/:id",getUserById)
routes.get("/search",findByName)
routes.post("/sendFriendRequest",sendfriendRequest)
routes.put("/acceptFriendRequest/:requestId",acceptFriendRequest)


module.exports=routes;