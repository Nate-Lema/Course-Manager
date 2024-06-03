import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connection_to_db } from "./otherAppHelpers/connecting_to_DB";
import userRouter from "./users/users.router";
import { handle_all } from "./otherAppHelpers/handleAll";
import { error_handler } from "./otherAppHelpers/errorHandler";
import courseRouter from "./courses/courses.router";
import { checkAndVerifyToken } from "./middleware/verifyToken";
import { morgan_middleware } from "./middleware/morganMiddleware";

connection_to_db();

const app = express();

app.disable("x-powered-by");

app.use(morgan_middleware());
app.use(cors());
app.use(helmet());

app.use("/users", userRouter);
app.use("/courses", checkAndVerifyToken, courseRouter);
app.all("*", handle_all);

app.use(error_handler);

app.listen(4000, () => {
  console.log("Server is running on port 4000`");
});
