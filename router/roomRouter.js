const express=require('express');
const roomRouter=express.Router();
const {createRoom, getRooms,getRoomsByUser}=require('../controllers/roomController');
const {verify}=require('../controllers/commonController');


roomRouter.route('/createRoom').post(verify,createRoom);
roomRouter.route('/getRooms').get(getRooms);
roomRouter.route('/getRoomByUser').get(verify,getRoomsByUser);


module.exports=roomRouter;