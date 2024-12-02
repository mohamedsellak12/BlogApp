const express=require('express')
const { register, login, logout, updateUserPassword, updateUserInfo } = require('../Controllers/UserController');
const { authenticateToken } = require('../middleware/authMiddleware');

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
routes.put("/update/:id",updateUserPassword)
routes.put("/updateInfo/:id",updateUserInfo)


module.exports=routes;