import controllers from '@controllers/buy';
import { Router } from 'express';
import passport from 'passport';
const router = Router();

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

router.get(
  '/premium',
  // TODO: Forbidden for mentee or already premium users
  (req: IReq, res: IRes, next) => {
    return next();
  },
  controllers.premium,
);

export default router;
