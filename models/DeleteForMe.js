const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');
const DeleteChatForMe=sequelize.define('DeleteChatForMe',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    deleted_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
},{
    tableName: 'DeleteChatForMe',
    timestamps: false, // because DB already has created_at
    indexes:[
        {
            unique: true,
            fields: ['user_id', 'message_id']
        }
    ]
});

module.exports=DeleteChatForMe;