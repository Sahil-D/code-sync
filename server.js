const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server);

// frontend routes handling

app.use(express.static('build'));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ------------------------- SOCKET --------------------------------------------

const userSocketMap = {}; // { socketId : username }

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on('connection', (socket) => {
  // console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    // console.log(userSocketMap);

    // Get all users of that room
    const clients = getAllConnectedClients(roomId);

    // sending newUser's data & clients list to all pre-existing users
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username, // The user who just joined
        socketId: socket.id, // socket id of user who just joined
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // socket.in  instead of   io.to
    // we dont want to emit same code to ourselves
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  // pre-existing code for new joinee
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // socket.in  instead of   io.to
    // we dont want to emit same code to ourselves
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
