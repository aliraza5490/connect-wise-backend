import controllers from '@controllers/info';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.get('/me', controllers.userInfo);
router.get('/mentors', controllers.mentors);

export default router;
