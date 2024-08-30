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
      onlineUsers.set(socket.decoded.id, socket.id);
      console.log(onlineUsers);

      socket.on('disconnect', () => {
        onlineUsers.forEach((value, key) => {
          if (value === socket.id) {
            onlineUsers.delete(key);
          }
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
