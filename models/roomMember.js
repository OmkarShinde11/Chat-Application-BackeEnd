const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');
const roomMemberSchema=sequelize.define('RoomMember',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    room_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    joined_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    }
},{
    tableName:'roomMember',
    timestamps:false,
    indexes: [
        {
          unique: true,
          fields: ['room_id', 'user_id']
        }
      ]
});


module.exports=roomMemberSchema;