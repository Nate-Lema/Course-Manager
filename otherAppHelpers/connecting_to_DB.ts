import mongoose from "mongoose";
import "dotenv/config";

export function connection_to_db() {
  if (process.env.PATH_TO_DB)
    mongoose
      .connect(process.env.PATH_TO_DB)
      .then((_) => console.log("connected to DB"))
      .catch(console.log);
}
