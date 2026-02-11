const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  type:{
    type:DataTypes.ENUM('user','system'),
    defaultValue:'user'
  },
  reply_to_message_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }

}, {
  tableName: 'chats',
  timestamps: false, // because DB already has created_at
});

module.exports = Chat;
