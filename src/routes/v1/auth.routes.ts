import controllers from '@controllers/auth';
import express from 'express';
const router = express.Router();

// routes
router.post('/login', controllers.login);
router.post('/register', controllers.register);
router.post('/become-mentor', controllers.becomeMentor);

export default router;
