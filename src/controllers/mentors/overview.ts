import Order from '@models/Order';

export default async (req: IReq, res: IRes) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // this year's mentor revenue for each month
  const monthlyRevenue = [];
  for (let i = 0; i < 12; i++) {
    const start = new Date(new Date().getFullYear(), i, 1);
    const end = new Date(new Date().getFullYear(), i + 1, 0, 23, 59, 59, 999);
    const orders = await Order.find({
      mentor: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
      paid: true,
    });
    const total = orders.reduce((acc, order) => acc + order.price, 0);
    monthlyRevenue.push({
      name: months[i],
      total,
    });
  }

  return res.send(monthlyRevenue);
};
