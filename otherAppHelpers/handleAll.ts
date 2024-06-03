import { RequestHandler } from "express";
import { ErrorWithStatus } from "../types/error";

export const handle_all: RequestHandler<unknown, unknown, unknown, unknown> = (
  req,
  res,
  next
) => {
  next(new ErrorWithStatus("Route not Found", 404));
};
