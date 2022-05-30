let users = [];

const editData = (data, id, call) => {
  const newData = data.map((item) =>
    item.id === id ? { ...item, call } : item
  );
  return newData;
};

const SocketServer = (socket) => {
  // connect  && disconnect
  socket.on("joinUser", (user) => {
    users.push({
      id: user._id,
      socketId: socket.id,
      followers: user.followers,
    });
  });

  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
    if (data) {
      const clients = users.filter((user) =>
        data.followers.find((item) => item._id === user.id)
      );
      if (clients.length > 0) {
        clients.forEach((client) => {
          socket
            .to(`${client.socketId}`)
            .emit("checkuserOffLineToClient", data.id);
        });
      }
      if (data.call) {
        const callUser = users.find((user) => user.id === data.call);
        if (callUser) {
          users = editData(users, callUser.null);
          socket.to(`${callUser.socketId}`).emit("callerDisconnect");
        }
      }
    }

    users = users.filter((user) => user.socketId !== socket.id);
  });

  // like  && dislike
  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });

  socket.on("unLikePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unLikeToClient", newPost);
      });
    }
  });

  //create comment && deleteComment
  socket.on("createComment", (newPost) => {
    if (newPost) {
      const ids = [...newPost.user.followers, newPost.user._id];
      const clients = users.filter((user) => ids.includes(user.id));
      if (clients.length > 0) {
        clients.forEach((client) => {
          socket
            .to(`${client.socketId}`)
            .emit("createCommentToClient", newPost);
        });
      }
    }
  });

  socket.on("deleteComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteCommentToClient", newPost);
      });
    }
  });
  // follow && unFolow

  socket.on("follow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    if (user) {
      socket.to(`${user.socketId}`).emit("followToClient", newUser);
    }
  });

  socket.on("unFollow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    if (user) {
      socket.to(`${user.socketId}`).emit("unFollowToClient", newUser);
    }
  });

  // notify

  socket.on("creaNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("creaNotifyToClient", msg);
    // if (clients.length > 0) {
    //   clients.forEach((client) => {
    //     socket.to(`${client.socketId}`).emit("creaNotifyToClient", msg);
    //   });
    // }
  });
  socket.on("removeNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);

    // if (clients.length > 0) {
    //   clients.forEach((client) => {
    //     socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);
    //   });
    // }
  });

  // message

  socket.on("addMessage", (msg) => {
    const user = users.find((user) => user.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
  });

  // chek user onlone

  socket.on("chekUserOnline", (data) => {
    // data => auth.user

    const following = users.filter((user) =>
      data.following.find((item) => item._id === user.id)
    );

    socket.emit("chekUserOnlineToMe", following);

    const clients = users.filter((user) =>
      data.followers.find((item) => item._id === user.id)
    );

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("checkUserOnlineToClient", data._id);
      });
    }
  });

  // call user

  socket.on("callUser", (data) => {
    // console.log({ olduser: users });
    users = editData(users, data.sender, data.recipient);
    const client = users.find((user) => user.id === data.recipient);

    if (client) {
      if (client.call) {
        users = editData(users, data.sender, null);
        socket.emit("userBusy", data);
      } else {
        users = editData(users, data.recipient, data.sender);
        socket.to(`${client.socketId}`).emit("callUserToClient", data);
      }
    }
    // console.log({ newuser: users });
  });

  // end call
  socket.on("endCall", (data) => {
    const client = users.find((user) => user.id === data.sender);
    if (client) {
      socket.to(`${client.socketId}`).emit("endCallToClient", data);
      users = editData(users, client.id, null);
      if (client.call) {
        const clientCall = users.find((user) => user.id === client.call);
        clientCall &&
          socket.to(`${clientCall.socketId}`).emit("endCallToClient", data);
        users = editData(users, client.call, null);
      }
    }
  });
};

module.exports = SocketServer;
