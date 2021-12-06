const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Chat = require("./chat");

// associations

Message.belongsTo(Conversation);
Conversation.hasMany(Message);
User.belongsToMany(Conversation, { through: Chat });
Conversation.belongsToMany(User, { through: Chat });
// This enables us to use the Super Many-to-Many relationship.
// for more info: https://sequelize.org/master/manual/advanced-many-to-many.html
User.hasMany(Chat);
Chat.belongsTo(User);
Conversation.hasMany(Chat);
Chat.belongsTo(Conversation);

module.exports = {
  User,
  Conversation,
  Message,
  Chat,
};
