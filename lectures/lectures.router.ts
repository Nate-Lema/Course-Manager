import express from "express";

import { parseBody } from "../middleware/parseBody";
import {
  delete_lecture,
  get_lecture,
  post_lecture,
  put_lecture,
} from "./lectures.controller";

const lectureRouter = express.Router({ mergeParams: true });

lectureRouter.post("/", parseBody(), post_lecture);
lectureRouter.get("/", get_lecture);
lectureRouter.put("/:lecture_id", parseBody(), put_lecture);
lectureRouter.delete("/:lecture_id", delete_lecture);

export default lectureRouter;
