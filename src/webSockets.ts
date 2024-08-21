import { Server } from 'socket.io';

export const onlineUsers = new Map();

/**
 * Listen on Web Sockets
 */
export default function webSockets(io: Server) {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      });
    });
    socket.on('join', (id: string, callback) => {
      onlineUsers.set(id, socket.id);
      console.log('onlineUsers', onlineUsers);
      callback({
        status: 'ok',
      });
    });
  });
}
