const http=require('http');
const { Server } = require("socket.io");
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const app=require('./app');
const {Chat,User}=require('./models');

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
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
});

server.listen(process.env.PORT,()=>{
    console.log(`server listen on port ${process.env.PORT}`);
});