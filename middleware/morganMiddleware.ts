import fs from "fs";
import { join } from "path";
import morgan from "morgan";

export function morgan_middleware() {
  if (process.env.NODE_ENV === "development") {
    return morgan("dev");
  } else if (process.env.NODE_ENV === "production") {
    const accessLogStream = fs.createWriteStream(
      join(__dirname, "access.log"),
      { flags: "a" }
    );
    return morgan("combined", { stream: accessLogStream });
  } else {
    return morgan("dev");
  }
}
