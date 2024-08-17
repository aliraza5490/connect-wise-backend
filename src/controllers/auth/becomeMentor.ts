import Mentor from '@models/Mentor';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const becomeMentor = async (req: IReq, res: IRes) => {
  const schema = z.object({
    firstName: z.string().min(2).max(80),
    lastName: z.string().min(2).max(80),
    gender: z.enum(['Male', 'Female']),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    linkedInProfile: z.string().min(2).max(200),
    bio: z.string().min(2).max(500),
    pricePerMonth: z.number().int().positive(),
    country: z.string().min(2).max(2),
    title: z.string().min(2).max(80),
    level: z.string().min(2).max(80),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const existingUser = await Mentor.findOne({
    email: value.data.email,
  });

  if (existingUser) {
    return res.status(409).json({
      message: 'User already exists',
    });
  }

  const passHash = await bcrypt.hash(value.data.password, 10);

  await new Mentor({
    firstName: value.data.firstName,
    lastName: value.data.lastName,
    email: value.data.email,
    password: passHash,
    linkedInProfile: value.data.linkedInProfile,
    pricePerMonth: value.data.pricePerMonth,
    gender: value.data.gender,
    country: value.data.country,
    bio: value.data.bio,
    title: value.data.title,
    level: value.data.level,
  }).save();

  return res.json({ success: true });
};

export default becomeMentor;
