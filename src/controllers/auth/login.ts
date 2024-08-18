import Mentor from '@models/Mentor';
import User from '@models/User';
import { signJWT } from '@utils/helpers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginController = async (req: IReq, res: IRes) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  let user = await User.findOne({ email: value.data.email, isActive: true });
  let role = 'user';

  if (!user) {
    user = await Mentor.findOne({ email: value.data.email, isActive: true });
    role = 'mentor';
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }
  }

  const isValid = bcrypt.compareSync(value.data.password, user.password);

  if (!isValid) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  return res.json({ token: signJWT(user, role) });
};

export default loginController;
