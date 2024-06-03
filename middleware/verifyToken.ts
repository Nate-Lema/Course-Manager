import { verify } from "jsonwebtoken";
import { RequestHandler } from "express";
import { JWTContent } from "../types/jwtType";
import { ErrorWithStatus } from "../types/error";
import "dotenv/config";

export const checkAndVerifyToken: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      if (process.env.JWT_SECRET) {
        const result = verify(token, process.env.JWT_SECRET) as JWTContent;
        if (result) {
          req.userInfo = result;
          next();
        }
      }
    }
  } catch (error) {
    next(new ErrorWithStatus("You are not authorized", 401));
  }
};
