module.exports=(err,req,res,next)=>{
   err.statusCode=err.statusCode || 500;
   err.status=err.statusCode ? 'Fail':'Error',
   res.status(err.statusCode).json({
    status:err.status,
    error:err,
    message:err.message,
    stackTrace:err.stack,
});
};