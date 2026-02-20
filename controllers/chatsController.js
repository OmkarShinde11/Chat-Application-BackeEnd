const { User,Chat, ChatReaction, DeleteChatForMe } = require('../models');
// const Chat=require('../models/chats');
const AppError = require('../utils/AppError');
const multer=require('multer');
const path=require('path');
const fs=require('fs');
const { getIo } = require('../utils/socket');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { prompt } = require('../utils/prompt');
const {Sequelize, Op}=require('sequelize');
const socket = require('../utils/socket');

const genAI = new GoogleGenerativeAI(process.env.SECRET_KEY);


const getRoomChats=async (req,res,next)=>{
    try{
        let {roomId}=req.params;
        if(roomId===undefined){
            return next(new AppError(404,'Please Provide roomID'))
        }
        const chats = await Chat.findAll({
          where: {
            room_id: Number(roomId),

            id: {
              [Op.notIn]: Sequelize.literal(`
                (SELECT message_id 
                FROM DeleteChatForMe 
                WHERE user_id = ${req.user?.id})
            `),
            },
          },
          include: [
            {
              model: User,
              as: "user",
            },
            {
              model: Chat,
              as: "replyTo",
            },
            {
              model: ChatReaction,
              as: "reaction",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        });

        const formattedChats=chats.map((chat)=>{
            const chatJson = chat.toJSON(); // important!
            if(chatJson.reaction && chatJson.reaction.length > 0){
                let obj={};
                chatJson.reaction.forEach((data)=>{
                    if(!obj[data.emoji]){
                        obj[data.emoji]={
                            emoji:data.emoji,
                            count:0,
                            users:[],
                        }
                    };
                    obj[data.emoji].count++;
                    obj[data.emoji].users.push(data.user);
                });
                chatJson.reaction=Object.values(obj);
            };
            return chatJson;
        });

        // console.log(formattedChats);

        res.status(200).json({
            status:'Success',
            message:'Chats Retrieved Successfully',
            chats:formattedChats,
        })
    }catch(err){
        return next(new AppError(500,err));
    }
}
const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const uploadPath=path.resolve(__dirname,'../Uploads/public');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath,{recursive:true});
        }
        cb(null,uploadPath);
    },filename:(req,file,cb)=>{
        console.log(file);
        const ext=file.mimetype.split('/')[1];
        const fileName=file.originalname;
        cb(null,fileName);
    }
})
const multerFilter=(req,file,cb)=>{
    if(file){
        cb(null,true);
    }else{
        cb(new AppError(400,'Please Provide File'),false);
    }
}

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter,
});

const uploadFile=upload.single('file');

const saveFiledata=async (req,res,next)=>{
   try{
    const {room_id,user_id}=req.body;
    console.log(req.file);
    const file_url=`${req.protocol}://${req.get('host')}/Uploads/public/${req.file.filename}`
    let message_type;
    if(req.file.mimetype.startsWith('image')) message_type='image';
    else if(req.file.mimetype.startsWith('video')) message_type='video';
    else if(req.file.mimetype.startsWith('audio')) message_type='audio';
    else message_type='document';
    const chat=await Chat.create({
        room_id:Number(room_id),
        user_id:Number(user_id),
        message:null,
        message_type:message_type,
        file_url:file_url,
        file_name:req.file.filename,
        file_size:req.file.size,
        mime_type:req.file.mimetype,
    });
    const io=getIo();

    io.to(Number(room_id)).emit('new-message',chat);
    return res.status(200).json({
        status:'Success',
        chat,
    })
   }catch(err){
    return next(new AppError(500,err))
   }
}

const aiChat = async (req, res, next) => {
    try {
      const { message } = req.body;
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest"
      });
      const models = await genAI.listModels();
      console.log(models);
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: "Hello" }]
          }
        ]
      });      const response = result.response.text();
      res.status(200).json({
        status: "success",
        reply: response,
      });
  
    } catch (err) {
      return next(new AppError(500, err.message));
    }
};

const deleteForMe=async (req,res,next)=>{
    try{
        const {user_id,message_id}=req.body;
        const deleteChat=await DeleteChatForMe.create({
            user_id:user_id,
            message_id:message_id,
        });
        const io=getIo();
        io.emit('deleteForMe',message_id);
        res.status(200).json({
            status:'Success',
            message:'Chat Deleted Successfully',
        });
    }catch(err){
        next(new AppError(500,err));
    }
};

const delteChatForEveryOne=async(req,res,next)=>{
    const {chat_id,room_id}=req.body;
    try{
        const deleteChat=await Chat.update({
            is_deleted_for_everyone:true,
            deleted_for_everyone_at:new Date(),
        },{where:{id:chat_id}});

        const newChat=await Chat.findByPk(chat_id);

        const io=getIo();
        io.to(Number(room_id)).emit('deleteForEveryOne',{chat_id,newChat:newChat});
        res.status(200).json({
            status:'Success',
            message:'message deleted successfully',
        })
    }catch(err){
        next(new AppError(500,err));
    }
}


const restoreDelEveryOneMsg= async (req,res,next)=>{
    try{
        const {message_id,room_id}=req.body;
        await Chat.update({
            is_deleted_for_everyone:false,
            deleted_for_everyone_at:null,
        },{where:{id:message_id}});

        const restoreChat=await Chat.findByPk(message_id,{
            include: [
                {
                  model: User,
                  as: "user",
                },
                {
                  model: Chat,
                  as: "replyTo",
                },
                {
                  model: ChatReaction,
                  as: "reaction",
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
        });
        const io=getIo();
        io.to(Number(room_id)).emit('restoreMsg',{chat_id:message_id,newChat:restoreChat});
        res.status(200).json({
            status:'Success',
            message:'message restore successfully',
        })
    }catch(err){
        next(new AppError(500,err));
    }
}

const restoreDelMeMsg=async (req,res,next)=>{
    try{
        const {message_id}=req.body;
        await DeleteChatForMe.destroy({
            where:{
                message_id:message_id
            }
        });
        const restoreChat=await Chat.findAll({where:{
            id:message_id
        },include: [
            {
              model: User,
              as: "user",
            },
            {
              model: Chat,
              as: "replyTo",
            },
            {
              model: ChatReaction,
              as: "reaction",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],});
        const io=getIo();
        io.emit('restoreMsgMe',restoreChat);
        res.status(200).json({
            status:'Success',
            message:'message restore successfully',
        });
    }catch(err){
        next(new AppError(500,err));
    }
}

module.exports={
    getRoomChats,
    uploadFile,
    saveFiledata,
    aiChat,
    deleteForMe,
    delteChatForEveryOne,
    restoreDelEveryOneMsg,
    restoreDelMeMsg
}