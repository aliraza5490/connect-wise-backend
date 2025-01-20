import controllers from '@controllers/info';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.get('/me', controllers.userInfo);
router.get('/orders', controllers.orders);
router.post('/mentor', controllers.mentor);

export default router;
