import Order from '@models/Order';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

export const onlineUsers = new Map();

/**
 * Listen on Web Sockets
 */
export default function webSockets(io: Server) {
  io.use(function (
    socket: Socket & {
      decoded: any;
    },
    next,
  ) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token as string,
        process.env.JWT_SECRET,
        function (err, decoded) {
          if (err) return next(new Error('Authentication error'));
          socket.decoded = decoded;
          next();
        },
      );
    } else {
      next(new Error('Authentication error'));
    }
  }).on(
    'connection',
    (
      socket: Socket & {
        decoded: any;
      },
    ) => {
      socket.on('disconnect', () => {
        onlineUsers.forEach((value, key) => {
          if (value === socket.id) {
            onlineUsers.delete(key);
          }
        });
      });
      socket.on('join', (id: string, callback) => {
        onlineUsers.set(socket.decoded.id, socket.id);
        console.log('onlineUsers', onlineUsers);
        callback({
          status: 'ok',
        });
      });
      socket.on('get_online', async (type: string, callback) => {
        if (type == 'mentors') {
          const onlineMentors = [];
          const orders = await Order.find({
            paid: true,
            expiringOn: { $gte: new Date() },
          }).populate('mentor');
          onlineUsers.forEach((value, key) => {
            if (orders.find((order) => order.mentor._id.toString() === key)) {
              onlineMentors.push(key);
            }
          });
          return callback({
            status: 'ok',
            onlineMentors,
          });
        }
        if (type == 'users') {
          const onlineUsersList = [];
          const orders = await Order.find({
            paid: true,
            expiringOn: { $gte: new Date() },
          }).populate('user');
          onlineUsers.forEach((value, key) => {
            if (orders.find((order) => order.user._id.toString() === key)) {
              onlineUsersList.push(key);
            }
          });
          return callback({
            status: 'ok',
            onlineUsers: onlineUsersList,
          });
        }
        return callback({
          status: 'error',
          message: 'Invalid type',
        });
      });
    },
  );
}
