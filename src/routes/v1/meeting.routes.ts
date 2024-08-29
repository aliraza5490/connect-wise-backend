import controllers from '@controllers/meetings';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.post('/create', controllers.create);

export default router;
