const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      conversations[i] = convoJSON;

      const { unreadCount, firstUnreadIndex } = unreadCountAndFirstUnreadIndex(
        convoJSON.messages,
        userId
      );

      convoJSON.unreadCount = unreadCount;
      convoJSON.firstUnreadIndex = firstUnreadIndex;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

function unreadCountAndFirstUnreadIndex(messages, userId) {
  if (!Array.isArray(messages)) {
    throw "messages must be an array";
  }

  let unreadCount = 0;
  let firstUnreadIndex = -1;

  messages.forEach((message, index) => {
    const reversedMsg = messages[messages.length - (index + 1)];
    if (reversedMsg.unread && userId !== reversedMsg.senderId) {
      unreadCount += 1;
    }
    if (
      firstUnreadIndex < 0 &&
      reversedMsg.unread &&
      userId === reversedMsg.senderId
    ) {
      firstUnreadIndex = index;
    }
  });

  return { unreadCount, firstUnreadIndex };
}

module.exports = router;
