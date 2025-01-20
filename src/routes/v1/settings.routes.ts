import controllers from '@controllers/settings';
import { Router } from 'express';
import passport from 'passport';
const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.post('/update', controllers.update);

export default router;
