import express from "express";

import {
  delete_profile_picture,
  patch_profile_picture,
  post_profile_picture,
  post_signin,
  post_signup,
} from "./users.controller";
import { parseBody } from "../middleware/parseBody";
import multer from "multer";
import { checkAndVerifyToken } from "../middleware/verifyToken";

const userRouter = express.Router();
const update = multer({ dest: "upload" });

userRouter.post("/signup", parseBody(), post_signup);
userRouter.post("/signin", parseBody(), post_signin);
userRouter.post(
  "/:user_id/picture",
  checkAndVerifyToken,
  update.single("myfile"),
  post_profile_picture
);
userRouter.delete(
  "/:user_id/picture",
  checkAndVerifyToken,
  delete_profile_picture
);
userRouter.patch("/:user_id", checkAndVerifyToken, patch_profile_picture);

export default userRouter;
