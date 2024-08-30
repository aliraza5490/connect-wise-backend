import Order from '@models/Order';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

export const onlineUsersStore = new Map();

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
    if (socket.handshake?.auth?.token) {
      jwt.verify(
        socket.handshake.auth.token as string,
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
        onlineUsersStore.forEach((value, key) => {
          if (value === socket.id) {
            onlineUsersStore.delete(key);
          }
        });
      });

      socket.on('connect', () => {
        onlineUsersStore.set(socket.decoded.id, socket.id);
        console.log(onlineUsersStore);
      });

      socket.on('get_online', async (type: string, callback) => {
        if (type == 'mentors') {
          const onlineMentors = [];
          const orders = await Order.find({
            paid: true,
            expiringOn: { $gte: new Date() },
          }).populate('mentor');
          onlineUsersStore.forEach((value, key) => {
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
          const onlineUsers = [];
          const orders = await Order.find({
            paid: true,
            expiringOn: { $gte: new Date() },
          }).populate('user');
          onlineUsersStore.forEach((value, key) => {
            if (orders.find((order) => order.user._id.toString() === key)) {
              onlineUsers.push(key);
            }
          });
          return callback({
            status: 'ok',
            onlineUsers,
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
