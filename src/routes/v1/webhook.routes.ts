import controllers from '@controllers/webhook';
import express, { Router } from 'express';

const router = Router();

// stripe
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  controllers.stripe,
);

export default router;
