const {Sequelize}=require('sequelize');
const sequelize=new Sequelize("chat","root","Omkar@11@12",{
    host:'localhost',
    dialect:'mysql',
    dialectOptions: {
        charset: 'utf8mb4'
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
});
sequelize.authenticate().then(()=>console.log('Database Connect'))
.catch((err)=>console.log('Error While connecting database',err));

module.exports=sequelize;