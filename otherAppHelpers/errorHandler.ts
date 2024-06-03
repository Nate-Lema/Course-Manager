import { Request, Response, NextFunction } from "express";
import { ErrorWithStatus } from "../types/error";

export const error_handler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ErrorWithStatus) {
    res.status(error.status).send(error.message);
  } else if (error instanceof Error) {
    res.status(500).send(error.message);
  } else {
    res.status(500).send("An unknown error occurred");
  }
};
