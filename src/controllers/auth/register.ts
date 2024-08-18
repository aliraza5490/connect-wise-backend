import User from '@models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginController = async (req: IReq, res: IRes) => {
  const schema = z.object({
    firstName: z.string().min(2).max(80),
    lastName: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(6),
    linkedInProfile: z.string().optional().default(''),
    bio: z.string().optional().default(''),
    gender: z.enum(['Male', 'Female']),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const existingUser = await User.findOne({
    email: value.data.email,
  });

  if (existingUser) {
    return res.status(409).json({
      message: 'User already exists',
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
    gender: value.data.gender,
  }).save();

  return res.json({ success: true });
};

export default loginController;
