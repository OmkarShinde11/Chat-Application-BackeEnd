// const Room=require('../models/rooms');
const AppError = require('../utils/AppError');
// const RoomMember=require('../models/roomMember');
const {Room,RoomMember}=require('../models')
const sequelize=require('../utils/db-connection');
const createRoom=async (req,res,next)=>{
    try{
        const t = await sequelize.transaction();
        const {name,members}=req.body;
        const room=await Room.create({
            name:name
        },{transaction:t});
        const roomMembers=members.map((el)=>{
            return {
                room_id:room?.id,
                user_id:el
            }
        });
        console.log(roomMembers);
        await RoomMember.bulkCreate(roomMembers,{transaction:t})
        await t.commit();

        res.status(200).json({
            status:'Success',
            message:'Room Created Successfully',
            room
        })
    }catch(err){
        await t.rollback();
        return next(new AppError(500,err));
    };
};

const getRooms=async (req,res,next)=>{
    try{
        const rooms=await Room.findAll();
        res.status(200).json({
            status:'Success',
            message:'Room Retreived Successfully',
            rooms
        })
    }catch(err){
        return next(new AppError(500,err));
    };
};

const getRoomsByUser=async (req,res,next)=>{
    try{
        console.log(req.user);
        let user=req.user;
        let rooms_id=await RoomMember.findAll({
            where:{
                user_id:user.id,
            },
            attributes:['room_id'],
        });

        let rooms=await Room.findAll({
            where:{
                id:rooms_id.map(el=>el.room_id)
            }
        })
        res.status(200).json({
            status:'Success',
            message:'Rooms Retrived successfully',
            rooms,
        })
    }catch(err){
        return next(new AppError(400,err));
    }
}

module.exports={
    createRoom,
    getRooms,
    getRoomsByUser
}