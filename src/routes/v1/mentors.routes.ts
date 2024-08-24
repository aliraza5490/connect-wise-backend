import controllers from '@controllers/mentors';
import express from 'express';
import passport from 'passport';
const router = express.Router();

// routes
router.get('/featured', controllers.featuredList);
router.post('/search', controllers.search);
router.get('/list', controllers.list);

router.use(passport.authenticate('jwt', { session: false }));
router.post('/review', controllers.review);
router.use((req: IReq, res: IRes, next) => {
  if (!req.user?.pricePerMonth) {
    return res.status(403).send('Access denied');
  }
  next();
});
router.get('/overview', controllers.overview);
router.get('/stats', controllers.stats);

export default router;
