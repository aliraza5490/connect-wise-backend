import controllers from '@controllers/info';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.get('/me', controllers.userInfo);
router.post('/mentor', controllers.mentor);

export default router;
