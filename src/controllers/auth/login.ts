import User from '@models/User';
import { signJWT } from '@utils/helpers';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

const loginController = async (req: IReq, res: IRes) => {
  const { error, value } = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).validate(req.body);

  if (error) {
    const errors = error.details.map((err) => ({
      name: err.context.label,
      message: err.message,
    }));

    return res.status(400).json({ errors });
  }

  const user = await User.findOne({ email: req.body.email, isActive: true });

  if (!user) {
    return res.status(401).json({
      errors: [
        {
          name: 'auth',
          message: 'Invalid credentials',
        },
      ],
    });
  }

  const isValid = bcrypt.compareSync(value.password, user.password);

  if (!isValid) {
    return res.status(401).json({
      errors: [
        {
          name: 'auth',
          message: 'Invalid credentials',
        },
      ],
    });
  }

  return res.json({ token: signJWT(user) });
};

export default loginController;
