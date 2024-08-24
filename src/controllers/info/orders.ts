import Order from '@models/Order';

export default async (req: IReq, res: IRes) => {
  const isMentor = !!req.user?.pricePerMonth;
  const orders = await Order.find({
    [isMentor ? 'mentor' : 'user']: req.user?._id,
    paid: true,
  }).populate(
    isMentor ? 'user' : 'mentor',
    isMentor ? 'firstName lastName email' : 'firstName lastName',
  );

  return res.json(orders);
};
