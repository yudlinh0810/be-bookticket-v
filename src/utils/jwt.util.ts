import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Tạo Access Token
export const generalAccessToken = ({ id, role }: { id: string; role: string }): string => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
};

// Tạo Refresh Token
export const generalRefreshToken = ({ id, role }: { id: string; role: string }): string => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

// Xác minh Access Token
export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    console.log("decode", decode);
    req.user = decode;
    console.log("req.user", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// Xác minh Refresh Token & cấp lại Access Token
export const verifyRefreshToken = (
  token: string
): Promise<
  | {
      access_token: string;
      expirationTime: number;
    }
  | { status: string; message: string }
> => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user: any) => {
      if (err) {
        return resolve({ status: "ERR", message: "The authentication failed" });
      }
      const access_token = generalAccessToken({ id: user.id, role: user.role });

      const expirationTime = Date.now() + 60 * 1000;

      resolve({
        access_token,
        expirationTime,
      });
    });
  });
};
