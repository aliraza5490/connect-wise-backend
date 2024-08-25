import controllers from '@controllers/buy';
import express from 'express';
import passport from 'passport';
const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
// routes
router.post(
  '/',
  //  Forbidden for mentee
  (req: IReq, res: IRes, next) => {
    if (req.user?.pricePerMonth) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }
    return next();
  },
  controllers.buy,
);
router.post(
  '/premium',
  // Forbidden for mentee or already premium mentors
  (req: IReq, res: IRes, next) => {
    if (!req.user?.pricePerMonth) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }
    return next();
  },
  controllers.premium,
);

export default router;
