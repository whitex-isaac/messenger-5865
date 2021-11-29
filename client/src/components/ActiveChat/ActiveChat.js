import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { markAsRead } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, markAsRead } = props;

  const conversation = useMemo(() => {
    return props.conversation || {};
  }, [props.conversation]);

  // Store the number of unread messages and the field name (user1Unread/user2Unread)
  const [unreadMsgInfo, setUnreadMsgInfo] = useState({
    unreadMsgCount: "",
    unreadMsgName: "",
  });

  // preprocess data for the markAsRead function argument
  const userRead = useMemo(() => {
    return {
      conversationId: conversation.id,
      readMsg: { [unreadMsgInfo.unreadMsgName]: 0 },
    };
  }, [conversation.id, unreadMsgInfo.unreadMsgName]);

  useEffect(() => {
    if (user.id === conversation.user1Id) {
      setUnreadMsgInfo({
        unreadMsgCount: conversation.user1Unread,
        unreadMsgName: "user1Unread",
      });
    } else {
      setUnreadMsgInfo({
        unreadMsgCount: conversation.user2Unread,
        unreadMsgName: "user2Unread",
      });
    }
  }, [conversation, user.id]);

  useEffect(() => {
    const readMessage = async () => {
      await markAsRead(userRead);
    };

    unreadMsgInfo.unreadMsgCount > 0 && conversation.id && readMessage();
  }, [conversation, markAsRead, unreadMsgInfo.unreadMsgCount, userRead]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    markAsRead: (userRead) => {
      dispatch(markAsRead(userRead));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
