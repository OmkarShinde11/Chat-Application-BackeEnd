const { DataTypes } = require('sequelize');
const bcrypt=require('bcryptjs');
const sequelize=require('../utils/db-connection');
const userSchema=sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
    tableName:'users',
    timestamps:false,
    hooks:{
        beforeCreate:async (user)=>{
            user.password=await bcrypt.hash(user.password,12);
        }
    }
});

userSchema.prototype.checkPassword=async function(userEnterPassword,dbPassword){
    return await bcrypt.compare(userEnterPassword,dbPassword);
}
module.exports=userSchema;