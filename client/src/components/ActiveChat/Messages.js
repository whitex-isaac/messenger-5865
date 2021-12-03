import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { connect } from "react-redux";
import { markAsRead } from "../../store/utils/thunkCreators";
import { setReadMessagesInfo } from "../../store/conversations";

const Messages = (props) => {
  const {
    messages,
    otherUser,
    userId,
    markAsRead,
    setReadMessagesInfo,
    conversation,
  } = props;

  const { readMsgInfo, lastReadMsgId, id: conversationId } = conversation;

  useEffect(() => {
    if (
      readMsgInfo &&
      userId !== readMsgInfo.senderId &&
      readMsgInfo.readMessageIds.length > 0 &&
      readMsgInfo.lastMsgIndex >= 0
    ) {
      markAsRead(readMsgInfo);
    }
  }, [readMsgInfo, userId, markAsRead]);

  useEffect(() => {
    if (messages.length > 0) {
      setReadMessagesInfo({ messages, userId, conversationId });
    }
  }, [messages, userId, conversationId, setReadMessagesInfo]);

  return (
    <Box>
      {messages.map((message, index) => {
        const reversedMsg = messages[messages.length - (index + 1)];
        const time = moment(reversedMsg.createdAt).format("h:mm");
        const otherUserLastReadMsgId =
          lastReadMsgId === reversedMsg.id ? true : false;

        return reversedMsg.senderId === userId ? (
          <SenderBubble
            key={reversedMsg.id}
            text={reversedMsg.text}
            time={time}
            otherUser={otherUser}
            otherUserLastReadMsgId={otherUserLastReadMsgId}
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
    setReadMessagesInfo: (readMsgInfo) => {
      dispatch(setReadMessagesInfo(readMsgInfo));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
