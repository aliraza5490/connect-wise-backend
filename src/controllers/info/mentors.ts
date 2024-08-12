import User from '@models/User';

export default async (req: IReq, res: IRes) => {
  const mentors = await User.find({ role: 'mentor', isActive: true });
  return res.json(mentors);
};
