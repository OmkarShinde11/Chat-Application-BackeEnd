const http=require('http');
const { Server } = require("socket.io");
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const app=require('./app');
const {Chat,User, ChatReaction}=require('./models');

let roomNo;

const server=http.createServer(app);
const sequelize=require('./utils/db-connection');
const socket=require('./utils/socket');

const io = socket.init(server);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on('join',(roomId,callback)=>{
        console.log('socket connected');
        // roomNo=room;
        // socket.emit('message',{user:'admin',text:`${name} Welcome to the room ${room}`});
        // socket.broadcast.to(room).emit('message',{user:'admin',text:`${name} join the room`});

        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);

        // callback();
    });

    socket.on('leaveRoom',(roomId,callback)=>{
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
    })

    // socket.on('newUserJoin',({name,room},callback)=>{
    //     socket.emit('message',{user:'admin',text:`${name} Welcome to the room ${room}`});
    //     socket.broadcast.to(room).emit('message',{user:'admin',text:`${name} join the room`});
    // })

    socket.on('sendMessage',async ({roomId,userId,message,reply_to_message_id},callback)=>{
        // dummy logic.
        console.log(roomId,userId,message);
        let savedMessage;
        if(reply_to_message_id){
            savedMessage=await Chat.create({
                room_id:roomId,
                user_id:userId,
                message,
                reply_to_message_id,
            });
        }else{
            savedMessage=await Chat.create({
                room_id:roomId,
                user_id:userId,
                message
            });
        }

        const fullMessage=await Chat.findByPk(savedMessage.id,{
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
        // io.to(roomId).emit('new-message', {
        //     id: savedMessage.id,
        //     room_id: roomId,
        //     user_id: savedMessage.user_id,
        //     message: savedMessage.message,
        //     created_at: savedMessage.created_at,
        //     type:savedMessage.type
        //   });
        io.to(roomId).emit('new-message',fullMessage);
        // io.to(roomNo).emit('message',{user:'admin',text:'message Recived'});
        // callback();
    })

    socket.on('message:reaction',async({userId,emoji,chatId,roomId})=>{
        console.log(userId,emoji,chatId,roomId);
        const existingReaction=await ChatReaction.findOne({where:{
            chat_id:chatId,
            user_id:userId,
        }});

        // Create 
        if(!existingReaction){
            await ChatReaction.create({
                chat_id:chatId,
                user_id:userId,
                emoji
            })
        } // If same then delete
        else if(existingReaction.emoji===emoji){
            await existingReaction.destroy();
        }
         // Update
        else{
            existingReaction.emoji=emoji;
            await existingReaction.save();
        }
        let reaction=await ChatReaction.findAll({
            where:{
                chat_id:chatId
            },
            include:[
                {
                    model:User,
                    as:'user',
                    attributes:['id','name'],
                }
            ]
        });

        let obj={};
        reaction.forEach((data)=>{
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
        reaction=Object.values(obj);
        io.to(roomId).emit("message:reaction:updated", {
            chatId,
            reaction,
        });
    })
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
});

server.listen(process.env.PORT,()=>{
    console.log(`server listen on port ${process.env.PORT}`);
});