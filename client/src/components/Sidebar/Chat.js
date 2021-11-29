import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  unreadMsgCountWrapper: {
    padding: "0 8px",
    borderRadius: "50%",
    backgroundColor: "#3F92FF",
    marginRight: "30px",
  },
  unreadMsgCount: {
    fontFamily: " Open Sans",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "1px",
    letterSpacing: "-0.5px",
    textAlign: "center",
    color: "#ffffff",
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, user } = props;
  const { otherUser } = conversation;
  const unreadMsgCount =
    user.id === conversation.user1Id
      ? conversation.user1Unread
      : conversation.user2Unread;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {unreadMsgCount > 0 && (
        <div className={classes.unreadMsgCountWrapper}>
          <p className={classes.unreadMsgCount}>{unreadMsgCount}</p>
        </div>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
