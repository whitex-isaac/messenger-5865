const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Chat = require("./chat");

// associations

User.belongsToMany(Conversation, { through: "Chat" });
Conversation.belongsToMany(User, { through: "Chat" });
User.hasMany(Chat);
Chat.belongsTo(User);
Conversation.hasMany(Chat);
Chat.belongsTo(Conversation);
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  Chat,
};
