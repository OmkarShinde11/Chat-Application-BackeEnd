const User = require("../models/user");
const AppError = require("../utils/AppError")
const jwt=require('jsonwebtoken');
const verify=async (req,res,next)=>{
    try{
        let token=req?.headers?.authorization;
        token=token.split(' ')[1];
        if(!token){
            return next(new AppError(400,'Provide an token'));
        }
        const userDetails=jwt.verify(token,process.env.SECRETKEY);
        if(!userDetails){
            return next(new AppError(400,'Token is not valid'));
        }

        const user=await User.findOne({
            where:{
                id:userDetails.id,
            }
        });
        req.user=user;
        next();
    }catch(err){
        return next(new AppError(500,err));
    }
};

module.exports={
    verify
}