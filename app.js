const express=require('express');
const app=express();
const authRouter=require('./router/authRouter');
const roomRouter=require('./router/roomRouter');
const roomMemberRouter=require('./router/roomMemberRouter');
const chatRouter=require('./router/chatRouter');
const { rateLimit } = require('express-rate-limit');
const AppError = require('./utils/AppError');
const globalErrorHandaller=require('./utils/globalErrorHandaler');
const limit=rateLimit({
    max:10000,
    windowMs:60*60*1000,
    message:'Too many request from this Ip, please try again in an hour',
});
const cors=require('cors');

app.use((req, res, next) => {
    console.log('➡️ Incoming:', req.method, req.originalUrl);
    next();
  });

app.use(cors());
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded());
app.use('/api',limit);
app.use('/Uploads',express.static('Uploads'));

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/room',roomRouter);
app.use('/api/v1/roomMember',roomMemberRouter);
app.use('/api/v1/chat',chatRouter);

app.all('*',(req,res,next)=>{
    const err=new AppError(404,`Can't find the ${req.originalUrl} on server`);
    next(err);
});
app.use(globalErrorHandaller);

module.exports=app;
