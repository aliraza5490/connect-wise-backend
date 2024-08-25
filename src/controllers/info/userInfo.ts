import Premium from '@models/Premium';

export default async (req: IReq, res: IRes) => {
  let isFeatured = false;

  if (req.user.pricePerMonth) {
    const premium = await Premium.findOne({
      mentor: req.user._id,
      isActive: true,
    });

    if (premium) {
      isFeatured = true;
    }
  }

  return res.send({
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    avatar: req.user?.avatar,
    role: req.user?.pricePerMonth ? 'mentor' : 'user',
    gender: req.user.gender,
    email: req.user.email,
    linkedInProfile: req.user.linkedInProfile,
    bio: req.user.bio,
    isFeatured: req.user.pricePerMonth ? isFeatured : undefined,
    manageSubscriptions:
      req.user.pricePerMonth && isFeatured
        ? process.env.STRIPE_CUSTOMER_PORTAL
        : undefined,
  });
};
