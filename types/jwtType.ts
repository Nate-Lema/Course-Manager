import { Schema } from "mongoose";

export interface JWTContent {
  userId: Schema.Types.ObjectId;
  fullname: { first: string; last: string };
  email: string;
  profilePicPath: string;
}
