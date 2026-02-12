const sequelize = require("../utils/db-connection");
const { DataTypes } = require('sequelize');


const ChatReaction=sequelize.define('ChatReaction',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    emoji: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},{
    tableName: 'ChatReaction',
    timestamps: false, // because DB already has created_at
    indexes: [
        {
          unique: true,
          fields: ['chat_id', 'user_id']
        }
    ]
});

module.exports=ChatReaction;
