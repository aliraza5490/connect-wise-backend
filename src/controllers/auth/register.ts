import User from '@models/User';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { z } from 'zod';

// Configuration
cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

export default async (req: IReq, res: IRes) => {
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

  await new User({
    firstName: value.data.firstName,
    lastName: value.data.lastName,
    email: value.data.email,
    password: passHash,
    linkedInProfile: value.data.linkedInProfile,
    bio: value.data.bio,
    gender: value.data.gender,
    avatar: avatar.secure_url,
  }).save();

  return res.json({ success: true });
};
