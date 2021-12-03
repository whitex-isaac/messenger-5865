const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  unread: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

Message.getUnreadCount = async function (convoId, userId) {
  try {
    const unreadCount = await Message.findAll({
      where: {
        [Op.and]: [
          {
            conversationId: {
              [Op.eq]: convoId,
            },
          },
          {
            unread: {
              [Op.is]: true,
            },
          },
          {
            senderId: {
              [Op.not]: userId,
            },
          },
        ],
      },
      attributes: [
        [Sequelize.fn("count", Sequelize.col("unread")), "unreadCount"],
      ],
      group: ["unread"],
      raw: true,
    });

    return unreadCount;
  } catch (error) {
    throw error;
  }
};

Message.getLastReadMsgId = async function (convoId, userId) {
  try {
    const lastReadMsgId = await Message.findAll({
      where: {
        [Op.and]: [
          {
            conversationId: {
              [Op.eq]: convoId,
            },
          },
          {
            senderId: {
              [Op.eq]: userId,
            },
          },
          {
            unread: {
              [Op.is]: false,
            },
          },
        ],
      },
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "lastReadMsgId"]],
      group: ["id"],
      raw: true,
    });

    return lastReadMsgId;
  } catch (error) {
    throw error;
  }
};

module.exports = Message;
