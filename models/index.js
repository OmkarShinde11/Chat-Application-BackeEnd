const User = require('./user');
const Room = require('./rooms');
const Chat = require('./chats');
const RoomMember = require('./roomMember');
const sequlize=require('../utils/db-connection');

/* User ↔ RoomMembers */
User.hasMany(RoomMember, { foreignKey: 'user_id',as:'roomMembers' });
RoomMember.belongsTo(User, {
  foreignKey: 'user_id',
  as:'user',
  onDelete: 'CASCADE',
});

/* Room ↔ RoomMembers */
Room.hasMany(RoomMember, { foreignKey: 'room_id',as: 'roomMembers' });
RoomMember.belongsTo(Room, {
  foreignKey: 'room_id',
  as: 'room',
  onDelete: 'CASCADE',
});

/* User ↔ Chats */
User.hasMany(Chat, { foreignKey: 'user_id' });
Chat.belongsTo(User, {
  foreignKey: 'user_id',
  as:'user',
  onDelete: 'CASCADE',
});

/* Room ↔ Chats */
Room.hasMany(Chat, { foreignKey: 'room_id' });
Chat.belongsTo(Room, {
  foreignKey: 'room_id',
  as:'room',
  onDelete: 'CASCADE',
});

// Chats ->Reply
Chat.hasMany(Chat , {foreignKey:'reply_to_message_id'});
Chat.belongsTo(Chat,{
  as:'replyTo',
  foreignKey:'reply_to_message_id',
})

module.exports = {
  User,
  Room,
  Chat,
  RoomMember,
  sequlize
};
