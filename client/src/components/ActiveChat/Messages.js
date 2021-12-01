import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { connect } from "react-redux";
import { markAsRead } from "../../store/utils/thunkCreators";

const Messages = (props) => {
  const {
    messages,
    otherUser,
    userId,
    conversationId,
    markAsRead,
    firstUnreadIndex,
  } = props;
  const [msgRead, setMsgRead] = useState({
    conversationId: "",
    senderId: "",
    readMessageIds: [],
  });
  const [lastMsgIndex, setLastMsgIndex] = useState(-1);

  const getUnreadMsgIds = useCallback(
    (msg, index) => {
      if (index === messages.length - 1) {
        setLastMsgIndex(index);
      }

      if (msg.unread && userId !== msg.senderId)
        setMsgRead((prevData) => {
          return {
            ...prevData,
            senderId: msg.senderId,
            readMessageIds: [...prevData.readMessageIds, msg.id],
          };
        });
    },
    [messages.length, userId]
  );

  useEffect(() => {
    if (conversationId) {
      setMsgRead((prevData) => {
        return { ...prevData, conversationId };
      });
    }
  }, [conversationId]);

  useEffect(() => {
    if (
      userId !== msgRead.senderId &&
      msgRead.readMessageIds.length > 0 &&
      lastMsgIndex !== -1
    ) {
      markAsRead(msgRead);
    }
  }, [lastMsgIndex, msgRead, userId, markAsRead]);

  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((message, index) => {
        getUnreadMsgIds(message, index);
      });
    }
  }, [messages, userId, getUnreadMsgIds]);

  return (
    <Box>
      {messages.map((message, index) => {
        const reversedMsg = messages[messages.length - (index + 1)];
        const time = moment(reversedMsg.createdAt).format("h:mm");
        const firstUnreadMsg = firstUnreadIndex === index ? true : false;

        return reversedMsg.senderId === userId ? (
          <SenderBubble
            key={reversedMsg.id}
            text={reversedMsg.text}
            time={time}
            otherUser={otherUser}
            firstUnreadMsg={firstUnreadMsg}
          />
        ) : (
          <OtherUserBubble
            key={reversedMsg.id}
            text={reversedMsg.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    markAsRead: (setAsRead) => {
      dispatch(markAsRead(setAsRead));
    },
  };
};

export default connect(null, mapDispatchToProps)(Messages);
