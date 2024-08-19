import User from '@models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    currentPassword: z.string().min(6),
    password: z.string().min(6),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const isMatch = await bcrypt.compare(
    value.data.currentPassword,
    req.user.password,
  );

  if (!isMatch) {
    return res.status(401).json({
      message: 'Invalid password',
    });
  }

  const passHash = await bcrypt.hash(value.data.password, 10);

  await User.findByIdAndUpdate(req.user._id, {
    password: passHash,
  });

  return res.json({ success: true });
};
