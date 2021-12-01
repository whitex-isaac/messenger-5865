export const addMessageToStore = (state, payload) => {
  const { message, sender, userId } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;

    if (userId && userId !== sender.id) {
      newConvo.unreadCount = 1;
    }
    newConvo.firstUnreadIndex = 0;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };

      convoCopy.messages = [message, ...convoCopy.messages];
      convoCopy.latestMessageText = message.text;

      if (userId && userId !== message.senderId) {
        convoCopy.unreadCount += 1;
      }

      if (convoCopy.firstUnreadIndex === -1) {
        for (let i = convoCopy.messages.length - 1; i >= 0; i--) {
          if (message.unread && userId !== message.senderId) {
            convoCopy.firstUnreadIndex = i;
            break;
          }
        }
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const readMessages = (state, setAsRead) => {
  return state.map((convo) => {
    if (convo.id === setAsRead.conversationId) {
      const convoCopy = { ...convo };

      if (setAsRead?.readMessageIds?.length > 0) {
        convoCopy.messages.forEach((message) => {
          if (message.unread) {
            setAsRead.readMessageIds.forEach((readMsgId) => {
              if (message.id === readMsgId) {
                message.unread = false;
              }
            });
          }

          convoCopy.unreadCount = 0;
        });
      }

      if (setAsRead.firstUnreadIndex) {
        convoCopy.firstUnreadIndex = setAsRead.firstUnreadIndex;
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [message, ...convoCopy.messages];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
