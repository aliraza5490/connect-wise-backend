export default (req: IReq, res: IRes) => {
  return res.send(req.user);
};
