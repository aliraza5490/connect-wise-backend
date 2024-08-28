import controllers from '@controllers/chat';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.get('/history', controllers.history);
router.post('/message', controllers.sendMessage);
router.post('/assistant', controllers.assistant);

export default router;
