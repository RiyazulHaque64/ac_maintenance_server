import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { TAuthUser } from "../interfaces/common";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const verifyToken = (token: string, secret: Secret): TAuthUser => {
  return jwt.verify(token, secret) as TAuthUser;
};
