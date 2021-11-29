import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message, index) => {
        const reversedMsg = messages[messages.length - (index + 1)];
        const time = moment(reversedMsg.createdAt).format("h:mm");

        return reversedMsg.senderId === userId ? (
          <SenderBubble
            key={reversedMsg.id}
            text={reversedMsg.text}
            time={time}
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

export default Messages;
