const express=require('express');
const { getRoomChats, uploadFile, saveFiledata, aiChat, delteChatForEveryOne, deleteForMe, restoreDelMeMsg, restoreDelEveryOneMsg } = require('../controllers/chatsController');
const { verify } = require('../controllers/commonController');

const chatRouter=express.Router();

chatRouter.route('/getChat/:roomId').get(verify,getRoomChats);
chatRouter.route('/uploadFile').post(uploadFile,saveFiledata);
chatRouter.route('/aiChat').post(aiChat);
chatRouter.route('/deleteMessageToEveryOne').patch(verify,delteChatForEveryOne);
chatRouter.route('/deleteMessageToMe').post(verify,deleteForMe);
chatRouter.route('/restoreDelMeMsg').post(verify,restoreDelMeMsg);
chatRouter.route('/restoreDelEveryOneMsg').patch(verify,restoreDelEveryOneMsg);


module.exports=chatRouter;