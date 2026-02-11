const express=require('express');
const { getRoomChats } = require('../controllers/chatsController');
const { verify } = require('../controllers/commonController');

const chatRouter=express.Router();

chatRouter.route('/getChat/:roomId').get(verify,getRoomChats);

module.exports=chatRouter;