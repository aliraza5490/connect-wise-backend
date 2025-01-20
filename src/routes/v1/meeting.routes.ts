import controllers from '@controllers/meetings';
import { Router } from 'express';
import passport from 'passport';
const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.post('/create', controllers.create);

export default router;
