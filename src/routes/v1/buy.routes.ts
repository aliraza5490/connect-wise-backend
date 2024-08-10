import controllers from '@controllers/buy';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.post('/', controllers.buy);

export default router;
