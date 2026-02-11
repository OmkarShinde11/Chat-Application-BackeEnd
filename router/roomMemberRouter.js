const express=require('express');
const roomMemberRouter=express.Router();
const {addRoomMembers,getRoomMembersByRoom}=require('../controllers/roomMembersController');

roomMemberRouter.route('/addRoomMember').post(addRoomMembers);
roomMemberRouter.route('/getRoomMembersByRoom/:roomId').get(getRoomMembersByRoom);


module.exports=roomMemberRouter;