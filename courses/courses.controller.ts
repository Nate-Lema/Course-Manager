import { RequestHandler } from "express";
import { StandardResponse } from "../types/standardResponse";
import { Course, CourseModel } from "./courses.model";
import { ErrorWithStatus } from "../types/error";

export const post_course: RequestHandler<
  unknown,
  StandardResponse<Course>,
  Course,
  unknown
> = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { userId, fullname, email } = req.userInfo;
    const fullNameString = `${fullname.first} ${fullname.last}`;

    const newCourse = await CourseModel.create({
      title,
      description,
      created_by: { user_id: userId, fullname: fullNameString, email },
    });
    res.json({
      success: true,
      message: `You successfully added a new course`,
      data: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const get_courses: RequestHandler<
  unknown,
  StandardResponse<Course[]>,
  unknown,
  { action: string }
> = async (req, res, next) => {
  try {
    const { action } = req.query;
    const page_size = 10;
    const page = 1;
    const query: any = {};
    if (action !== "all" && action !== "own") {
      throw new ErrorWithStatus("Invalid action", 400);
    }
    if (action === "own") {
      query["created_by.user_id"] = req.userInfo.userId;
    }
    const courses = await CourseModel.find(query)
      .skip((page - 1) * page_size)
      .limit(page_size);
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

export const get_course_by_id: RequestHandler<
  { course_id: string },
  StandardResponse<Course | {}>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const course = await CourseModel.findOne({ _id: course_id });
    if (!course) {
      next(new ErrorWithStatus("Course not found", 404));
    }
    res.json({ success: true, data: course || {} });
  } catch (error) {
    next(error);
  }
};

export const delete_course: RequestHandler<
  { course_id: string },
  StandardResponse<number>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const userId = req.userInfo.userId;
    const result = await CourseModel.deleteOne({
      _id: course_id,
      "created_by.user_id": userId,
    });
    if (result.deletedCount === 0) {
      new ErrorWithStatus(
        "Course not found or user does not own the course",
        404
      );
    }
    res.json({
      success: true,
      message: "Course deleted successfully",
      data: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const put_course: RequestHandler<
  { course_id: string },
  StandardResponse<number>,
  Course,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const { title, description } = req.body;
    const userId = req.userInfo.userId;
    const course = await CourseModel.updateOne(
      { _id: course_id, "created_by.user_id": userId },
      { $set: { title, description } }
    );
    if (course.modifiedCount === 0) {
      new ErrorWithStatus(
        "Course not found or user does not own the course",
        404
      );
    }
    res.json({
      success: true,
      message: "Course deleted successfully",
      data: course.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};


