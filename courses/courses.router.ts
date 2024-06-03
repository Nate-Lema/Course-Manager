import express from "express";
import {
  delete_course,
  get_course_by_id,
  get_courses,
  post_course,
  put_course,
} from "./courses.controller";
import { parseBody } from "../middleware/parseBody";
import lectureRouter from "../lectures/lectures.router";

const courseRouter = express.Router();

courseRouter.post("/", parseBody(), post_course);
courseRouter.get("/", get_courses);
courseRouter.get("/:course_id", get_course_by_id);
courseRouter.delete("/:course_id", delete_course);
courseRouter.put("/:course_id", parseBody(), put_course);

courseRouter.use("/:course_id/lectures", lectureRouter);

export default courseRouter;
