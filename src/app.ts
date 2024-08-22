import webhooks from '@routes/v1/webhook.routes';
import connectDB from '@utils/connectDBVercel';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import logger from 'morgan';
import path from 'path';

const log = debug('backend:server');

const app = express();
app.disable('x-powered-by');

// configure passport
import './auth';

// async error handling
import 'express-async-errors';

// --- Webhooks ---
app.use(helmet());
app.use(cors());
app.use('/api/v1/webhook', webhooks);

// --- Middlewares ---
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'common'));
app.use(express.static(path.join(__dirname, 'public')));

if (Number(process.env.VERCEL) === 1) {
  app.use('/api/v1/*', async (req: IReq, res: IRes, next) => {
    try {
      await connectDB();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errors: [{ name: 'Error', message: 'Database connection error' }],
      });
    }
    return next();
  });
} else {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    log('Connected to MongoDB');
  });
}

// --- Routes ---
import authRoutes from '@routes/v1/auth.routes';
import buyRoutes from '@routes/v1/buy.routes';
import chatRoutes from '@routes/v1/chat.routes';
import infoRoutes from '@routes/v1/info.routes';
import mentorRoutes from '@routes/v1/mentors.routes';
import settingsRoutes from '@routes/v1/settings.routes';
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/info', infoRoutes);
app.use('/api/v1/buy', buyRoutes);
app.use('/api/v1/mentor', mentorRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/chat', chatRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `${field} already exists`;
      return res.status(400).json({ errors: [{ name: field, message }] });
    }

    return res
      .status(500)
      .json({ errors: [{ name: 'Error', message: err.message }] });
  }
  return next();
});

app.use((req, res) => {
  return res
    .status(404)
    .json({ errors: [{ name: 'Error', message: 'Not found' }] });
});

export default app;
