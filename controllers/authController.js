const User=require('../models/user');
const jwt=require('jsonwebtoken');
const AppError = require('../utils/AppError');
const createToken=(userId)=>{
    return jwt.sign({id:userId},process.env.SECRETKEY,{expiresIn:process.env.EXPIRES_IN});
}
const signIn=async (req,res,next)=>{
   try{
        const newUser=await User.create(req.body);
        newUser.password=undefined;

        const token=createToken(newUser.id);

        return res.status(200).json({
            message:'User created successfully',
            newUser,
            token
        })
   }catch(err){
    console.log(err);
    return next(new AppError(500,err));
   }
};

const login=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email){
            return new AppError(400,'Please Enter Email and password');
        }
        const user=await User.findOne({
            where:{
                email:email
            }
        });
        if(!user){
            return next(new AppError(400,'User is not exist'));
        }
        if(!user.checkPassword(password,user.password)){
            return next(new AppError(400,'Invalid Password'));
        };

        user.password=undefined;
        const token=createToken(user.id);

        res.status(200).json({
            status:'Success',
            message:'User Login Successfully',
            user,
            token
        })
    }catch(err){
        return next(new AppError(500,err))
    }
}

const getAllUsers=async (req,res,next)=>{
    try{
        const users=await User.findAll();
        res.status(200).json({
            status:'Success',
            message:'Users retrieved successfully',
            users,
        })
    }catch(err){
        return next(new AppError(500,err));
    }
}


module.exports={
    signIn,
    login,
    getAllUsers
}