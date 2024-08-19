import controllers from '@controllers/settings';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.post('/update', controllers.update);

export default router;
