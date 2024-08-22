export default (req: IReq, res: IRes, next: INext) => {
  if (!req.user?.pricePerMonth) {
    return res.status(403).json({
      message: 'You are not allowed to access this route',
    });
  }
  return next();
};
