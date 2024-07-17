import User from '@models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginController = async (req: IReq, res: IRes) => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    linkedInProfile: z.string().url(),
    bio: z.string(),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
    });
  }

  const existingUser = await User.findOne({
    email: value.data.email,
    isActive: true,
  });

  if (existingUser) {
    return res.status(401).json({
      errors: [
        {
          name: 'auth',
          message: 'User already exists.',
        },
      ],
    });
  }

  const passHash = await bcrypt.hash(value.data.password, 10);

  await new User({
    firstName: value.data.firstName,
    lastName: value.data.lastName,
    email: value.data.email,
    password: passHash,
    linkedInProfile: value.data.linkedInProfile,
    bio: value.data.bio,
  }).save();

  return res.json({ success: true });
};

export default loginController;
