const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');
const roomSchema=sequelize.define('Rooms',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},{
    tableName:'rooms',
    timestamps:false
});

module.exports=roomSchema;