import controllers from '@controllers/info';
import express from 'express';
const router = express.Router();

// routes
router.post('/me', controllers.userInfo);

export default router;
