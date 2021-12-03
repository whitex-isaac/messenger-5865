import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: (props) =>
    props.unreadCount > 0
      ? {
          fontWeight: "bold",
          fontSize: 12,
          color: theme.palette.black.main,
          letterSpacing: -0.17,
        }
      : {
          fontSize: 12,
          color: theme.palette.lilac.light,
          letterSpacing: -0.17,
        },
}));

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser, unreadCount } = conversation;
  const classes = useStyles({ unreadCount });

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
