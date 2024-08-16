import Mentor from '@models/Mentor';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const becomeMentor = async (req: IReq, res: IRes) => {
  const schema = z.object({
    firstName: z.string().min(2).max(80),
    lastName: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    linkedInProfile: z.string().min(2).max(200),
    bio: z.string().min(2).max(500),
    expertise: z.string().min(2).max(80),
    experience: z.string().min(2).max(80),
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
    bio: value.data.bio,
    expertise: value.data.expertise,
    experience: value.data.experience,
  }).save();

  return res.json({ success: true });
};

export default becomeMentor;
