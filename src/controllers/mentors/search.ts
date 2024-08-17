import Mentor from '@models/Mentor';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    query: z.string().min(2).max(80),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const mentors = await Mentor.find({
    isActive: true,
    $text: { $search: value.data.query },
  }).select('-password');

  return res.json(mentors);
};
