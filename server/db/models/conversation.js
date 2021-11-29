const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  user1Unread: {
    type: Sequelize.SMALLINT,
    allowNull: false,
    defaultValue: 0,
  },
  user2Unread: {
    type: Sequelize.SMALLINT,
    allowNull: false,
    defaultValue: 0,
  },
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

/**
 * Update Conversation table by ID
 */
Conversation.updateById = async function (conversationId, updateData) {
  const result = await Conversation.update(updateData, {
    where: {
      id: {
        [Op.eq]: conversationId,
      },
    },
  });

  // If update was successful return 1
  return result;
};

module.exports = Conversation;
