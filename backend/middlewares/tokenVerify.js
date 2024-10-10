import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: 'token not found', success: false });

  const decode = await jwt.decode(token, process.env.JWT_SECRET);
  if (!decode) {
    return res.status(401).json({ message: 'tokan not valid', success: false });
  }
  req.user = decode;

  next();
};
