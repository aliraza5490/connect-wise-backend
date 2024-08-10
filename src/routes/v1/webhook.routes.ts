import controllers from '@controllers/webhook';
import express from 'express';

const router = express.Router();

// stripe
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  controllers.stripe,
);

export default router;
