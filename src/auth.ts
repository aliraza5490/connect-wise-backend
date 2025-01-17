import Mentor from '@models/Mentor';
import Premium from '@models/Premium';
import User from '@models/User';
import mongoose from 'mongoose';
import passport from 'passport';
import passportJWT from 'passport-jwt';

const JwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        let userType = 'user';

        let user: any = await User.findOne({
          _id: jwtPayload.id,
          isActive: true,
        }).lean();

        if (!user) {
          user = await Mentor.findOne({
            _id: jwtPayload.id,
            isActive: true,
          }).lean();

          if (!user) {
            return done(null, false);
          }

          userType = 'mentor';
        }

        user.isPremium = false;

        user.type = userType;

        const premCount = await Premium.countDocuments({
          user: new mongoose.Types.ObjectId(jwtPayload.id),
          isActive: true,
        });

        if (premCount > 0) {
          user.isPremium = true;
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);
