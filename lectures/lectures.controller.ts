import { RequestHandler } from "express";
import { StandardResponse } from "../types/standardResponse";
import { Lecture } from "./lectures.schema";
import { CourseModel } from "../courses/courses.model";
import { ErrorWithStatus } from "../types/error";

export const post_lecture: RequestHandler<
  { course_id: string },
  StandardResponse<any>,
  Lecture,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const userId = req.userInfo.userId;
    const lecture = await CourseModel.updateOne(
      { _id: course_id, "created_by.user_id": userId },
      { $addToSet: { lectures: req.body } }
    );
    if (lecture.modifiedCount === 0) {
      throw new ErrorWithStatus(
        "Lecture could not be added or Course/User not found",
        401
      );
    }
    res.json({
      success: true,
      message: `Lecture added`,
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const get_lecture: RequestHandler<
  { course_id: string },
  StandardResponse<Lecture[] | {}>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const userId = req.userInfo.userId;
    const lecture = await CourseModel.find(
      {
        _id: course_id,
        "created_by.user_id": userId,
      },
      { _id: 0, lectures: 1 }
    );
    if (!lecture) {
      new ErrorWithStatus("Lecture or Course/User not found", 404);
    }
    res.json({ success: true, message: `Lecture found`, data: lecture ?? {} });
  } catch (error) {
    next(error);
  }
};

export const put_lecture: RequestHandler<
  { course_id: string; lecture_id: string },
  StandardResponse<number>,
  Lecture,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id, lecture_id } = req.params;
    const userId = req.userInfo.userId;
    const lecture = await CourseModel.updateOne(
      {
        _id: course_id,
        "lectures._id": lecture_id,
        "created_by.user_id": userId,
      },
      {
        $set: { "lectures.$": req.body },
      }
    );
    if (lecture.modifiedCount === 0) {
      new ErrorWithStatus(
        "Lecture could not be updated or Course/User not found",
        404
      );
    }
    res.json({
      success: true,
      message: `Number of lecture updated`,
      data: lecture.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const delete_lecture: RequestHandler<
  { course_id: string; lecture_id: string },
  StandardResponse<number>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { course_id, lecture_id } = req.params;
    const userId = req.userInfo.userId;
    const lecture = await CourseModel.updateOne(
      {
        _id: course_id,
        "lectures._id": lecture_id,
        "created_by.user_id": userId,
      },
      { $pull: { lectures: { _id: lecture_id } } }
    );
    if (lecture.modifiedCount === 0) {
      new ErrorWithStatus(
        "Lecture could not be deleted or Course/User not found",
        404
      );
    }
    res.json({
      success: true,
      message: `Number of lecture deleted`,
      data: lecture.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};
