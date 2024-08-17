import Mentor from '@models/Mentor';
import User from '@models/User';
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
        let user = await User.findOne({
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
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);
