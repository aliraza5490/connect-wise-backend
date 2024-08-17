import controllers from '@controllers/mentors';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.get('/list', controllers.list);
router.get('/featured', controllers.featuredList);
router.post('/search', controllers.search);

export default router;
