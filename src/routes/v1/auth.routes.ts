import controllers from '@controllers/auth';
import express from 'express';
const router = express.Router();

// routes
router.post('/login', controllers.login);

export default router;
