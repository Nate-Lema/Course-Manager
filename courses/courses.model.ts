import { InferSchemaType, Schema, model } from "mongoose";
import { LectureSchema } from "../lectures/lectures.schema";

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_by: {
      user_id: Schema.Types.ObjectId,
      fullname: String,
      email: String,
    },
    lectures: [LectureSchema],
  },
  { timestamps: true, versionKey: false }
);

export type Course = InferSchemaType<typeof CourseSchema>;

export const CourseModel = model<Course>("course", CourseSchema);
