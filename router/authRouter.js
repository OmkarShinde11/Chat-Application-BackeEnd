const express=require('express');
const authRouter=express.Router();
const {signIn, login, getAllUsers}=require('../controllers/authController');
const { verify } = require('../controllers/commonController');

authRouter.route('/signIn').post(signIn);
authRouter.route('/login').post(login);
authRouter.route('/getAllUsers').get(verify,getAllUsers);

module.exports=authRouter;