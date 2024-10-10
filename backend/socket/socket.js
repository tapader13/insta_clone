import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ['GET', 'POST'],
  },
});

let userConnections = {};
export const getReciverSocketId = (id) => userConnections[id];
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userConnections[userId] = socket.id;
    console.log(`User connected: ${userId} and socket id: ${socket.id}`);
  }
  io.emit('getOnlineUsers', Object.keys(userConnections));
  socket.on('disconnect', () => {
    if (userId) {
      console.log(`User disconnected: ${userId} and socket id: ${socket.id}`);
      delete userConnections[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userConnections));
  });
});

export { app, server, io };
