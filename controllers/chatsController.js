const { User,Chat } = require('../models');
// const Chat=require('../models/chats');
const AppError = require('../utils/AppError');

const getRoomChats=async (req,res,next)=>{
    try{
        let {roomId}=req.params;
        if(roomId===undefined){
            return next(new AppError(404,'Please Provide roomID'))
        }
        const chats=await Chat.findAll({
            where:{
                room_id:Number(roomId)
            },
            include:[
                {
                    model:User,
                    as:'user',
                },
                {
                    model:Chat,
                    as:'replyTo'
                }
            ]
        });

        res.status(200).json({
            status:'Success',
            message:'Chats Retrieved Successfully',
            chats
        })
    }catch(err){
        return next(new AppError(500,err));
    }
}


module.exports={
    getRoomChats,
}