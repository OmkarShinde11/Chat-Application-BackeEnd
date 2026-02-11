const AppError = require('../utils/AppError');
// const RoomMember=require('../models/roomMember');
// const User=require('../models/user');
const { User, RoomMember, Chat } = require('../models');
const {getIo} =require('../utils/socket');
const addRoomMembers=async (req,res,next)=>{
    try{
        const {room_id,user_id,userName}=req.body;
        const member=await RoomMember.create({
            room_id:room_id,
            user_id:user_id,
        });
        const savedMessage=await Chat.create({
            room_id,
            message:`${userName} joined the room`,
            type:'system'
        });
        const io=getIo();
        io.to(room_id).emit('new-message',{
            id: savedMessage.id,
            room_id,
            user_id: savedMessage.user_id,
            message: savedMessage.message,
            created_at: savedMessage.created_at,
            type:savedMessage.type
        })
        res.status(200).json({
            status:'Success',
            message:'Member add successfully in room',
            member,
        })
    }catch(err){
        return next(new AppError(500,err));
    };
};

const getRoomMembersByRoom=async (req,res,next)=>{
    try{
        const {roomId}=req.params;
        const roomMembers=await RoomMember.findAll({
            where:{
                room_id:Number(roomId)
            },
            include:[
                {
                    model:User,
                    as:'user',
                    attributes:['name']
                }
            ]
        });
        res.status(200).json({
            status:'Success',
            message:'Room members retrieved successfully',
            roomMembers
        })
    }catch(err){
        return next(new AppError(500,err));
    };
};

module.exports={
    addRoomMembers,
    getRoomMembersByRoom
}