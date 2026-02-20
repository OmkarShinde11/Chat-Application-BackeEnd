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
    allowNull: true,
  },

  message_type: {
    type: DataTypes.ENUM('text','image','video','audio','document'),
    allowNull: false,
    defaultValue: 'text',
  },

  file_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
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
  },
  is_deleted_for_everyone:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  },
  deleted_for_everyone_at:{
    type:DataTypes.DATE,
    allowNull:true
  }

}, {
  tableName: 'chats',
  timestamps: false, // because DB already has created_at
});

module.exports = Chat;
