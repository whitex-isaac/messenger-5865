const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;
    let unreadToUpdate = {};

    //find a conversation by senderId or recipientId
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );
    let convoJSON =  conversation?.toJSON();

    // Increment either user1Unread or user2Unread by 1 and update conversation table
    if (conversation) {
      unreadToUpdate =
        convoJSON.user1Id === recipientId
          ? { user1Unread: convoJSON.user1Unread + 1 }
          : { user2Unread: convoJSON.user2Unread + 1 };

      await Conversation.updateById(convoJSON.id, unreadToUpdate);
    }

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      const convoUpdated = {
        user1Id: convoJSON.user1Id,
        user2Id: convoJSON.user2Id,
        ...unreadToUpdate,
      };
      return res.json({ convoUpdated, message, sender });
    }

    if (!conversation) {
      unreadToUpdate = { user2Unread: 1 };
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
        ...unreadToUpdate,
      });
      convoJSON = conversation.toJSON();
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    const convoUpdated = {
      user1Id: convoJSON.user1Id,
      user2Id: convoJSON.user2Id,
      ...unreadToUpdate,
    };
    res.json({ convoUpdated, message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
