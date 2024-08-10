export default (req: IReq, res: IRes) => {
  res.send(req.user);
};
