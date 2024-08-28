#!/usr/bin/env node
import { resolve } from 'path';

/**
 * Initialize
 */

import dotenv from 'dotenv';
dotenv.config({
  path: resolve(__dirname, '../.env'),
});

import moduleAlias from 'module-alias';
import { getAliases } from './utils/moduleAliases';

moduleAlias.addAliases(getAliases());

/**
 * Module dependencies.
 */

import debug from 'debug';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import webSockets from './webSockets';
const log = debug('backend:server');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const normalizedPort = normalizePort(process.env.PORT || '3000');
app.set('port', normalizedPort);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Create Web Sockets server.
 */
export const io = new Server(server, {
  path: '/api/v1/socket',
  addTrailingSlash: false,
  cors: {
    origin(requestOrigin, callback) {
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      console.log('requestOrigin');
      console.log(requestOrigin);
      console.log('process.env.FRONTEND_URL');
      console.log(process.env.FRONTEND_URL);
      if (requestOrigin.startsWith(process.env.FRONTEND_URL)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  },
});
webSockets(io);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof normalizedPort === 'string'
      ? `Pipe ${normalizedPort}`
      : `Port ${normalizedPort}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      return process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      return process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  log(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(normalizedPort);
server.on('error', onError);
server.on('listening', onListening);
