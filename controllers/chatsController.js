const { User,Chat, ChatReaction } = require('../models');
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
                },
                {
                    model:ChatReaction,
                    as:'reaction',
                    include:[
                        {
                            model:User,
                            as:'user',
                            attributes:['id','name'],
                        }
                    ]
                }
            ]
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


module.exports={
    getRoomChats,
}