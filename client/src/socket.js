import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  messagesRead,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(
      setNewMessage(data.message, data.sender, store.getState().user.id)
    );
  });

  socket.on("message-read", (data) => {
    store.dispatch(messagesRead(data));
  });
});

export default socket;
