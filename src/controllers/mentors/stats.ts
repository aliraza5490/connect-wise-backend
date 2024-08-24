import Order from '@models/Order';

export default async (req: IReq, res: IRes) => {
  const lastFiveSales = await Order.aggregate([
    { $match: { mentor: req.user._id, paid: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 1,
        price: 1,
        createdAt: 1,
        user: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          email: 1,
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
  ]);

  const currentMonthSalesCount = await Order.countDocuments({
    mentor: req.user._id,
    paid: true,
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  const totalRevenue = await Order.aggregate([
    { $match: { mentor: req.user._id, paid: true } },
    {
      $group: {
        _id: null,
        total: { $sum: '$price' },
      },
    },
  ]);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        mentor: req.user._id,
        paid: true,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$price' },
      },
    },
  ]);

  const activeOrders = await Order.find({
    mentor: req.user._id,
    paid: true,
    expiringOn: { $gte: new Date() },
  });

  return res.send({
    totalRevenue: totalRevenue?.length > 0 ? totalRevenue[0].total : 0,
    monthlyRevenue: monthlyRevenue?.length > 0 ? monthlyRevenue[0].total : 0,
    currentMonthSalesCount,
    activeOrders,
    lastFiveSales,
  });
};
