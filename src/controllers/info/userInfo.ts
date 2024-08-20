export default (req: IReq, res: IRes) => {
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
    isFeatured: req.user.isFeatured,
  });
};
