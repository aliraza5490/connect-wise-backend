import Mentor from '@models/Mentor';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { z } from 'zod';

// Configuration
cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

const becomeMentor = async (req: IReq, res: IRes) => {
  const schema = z.object({
    firstName: z.string().min(2).max(80),
    lastName: z.string().min(2).max(80),
    gender: z.enum(['Male', 'Female']),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    linkedInProfile: z.string().min(2).max(200),
    bio: z.string().min(2).max(500),
    pricePerMonth: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Price must be a positive number',
      }),
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

  const file = req.file;
  const avatar = await cloudinary.uploader.upload(file.path, {
    folder: 'avatars',
    public_id: `avatar_${value.data.email}`,
    format: file.mimetype.split('/')[1],
    width: 150,
    height: 150,
  });

  // delete file from file.path
  fs.unlinkSync(file.path);

  const passHash = await bcrypt.hash(value.data.password, 10);

  await new Mentor({
    avatar: avatar.secure_url,
    firstName: value.data.firstName,
    lastName: value.data.lastName,
    email: value.data.email,
    password: passHash,
    linkedInProfile: value.data.linkedInProfile,
    pricePerMonth: Number(value.data.pricePerMonth),
    gender: value.data.gender,
    country: value.data.country,
    bio: value.data.bio,
    title: value.data.title,
    level: value.data.level,
  }).save();

  return res.json({ success: true });
};

export default becomeMentor;
