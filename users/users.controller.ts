import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import { sign } from "jsonwebtoken";
import "dotenv/config";

import { GUEST_PICTURE, User, UserModel } from "./users.model";
import { StandardResponse } from "../types/standardResponse";
import { ErrorWithStatus } from "../types/error";
import fs from "node:fs";

export const post_signup: RequestHandler<
  unknown,
  StandardResponse<string>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      next(new ErrorWithStatus("Email already exists", 400));
    }
    const validatingEmail = validator.isEmail(email);
    if (!validatingEmail) throw new Error("Invalid Email");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      res.json({
        success: true,
        data: `You've Successfully Signed Up`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const post_signin: RequestHandler<
  unknown,
  StandardResponse<string>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      next(new ErrorWithStatus("Invalid email", 401));
    }
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        next(new ErrorWithStatus("Invalid password", 401));
      }
      let jwt;
      if (isPasswordValid) {
        if (process.env.JWT_SECRET) {
          jwt = sign(
            {
              userId: user._id,
              fullname: user.fullname,
              email: user.email,
              profilePicPath: user.picture.path,
            },
            process.env.JWT_SECRET
          );
        }
        res.setHeader("Authorization", `Bearer ${jwt}`);
        res.json({
          success: true,
          message: `Sign in successfully`,
          data: `Token:- ${jwt}`,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const post_profile_picture: RequestHandler<
  { user_id: string },
  StandardResponse<number>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const new_file = req.file;

    const user = await UserModel.updateOne(
      { _id: user_id },
      { $set: { picture: new_file } }
    );
    if (user.modifiedCount === 0) {
      next(new ErrorWithStatus("User not found", 404));
    }
    res.json({
      success: true,
      message: `Profile picture updated successfully!`,
      data: user.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const delete_profile_picture: RequestHandler<
  { user_id: string },
  StandardResponse<User | {}>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await UserModel.findOneAndUpdate(
      { _id: user_id },
      { $set: { picture: GUEST_PICTURE } }
    );

    if (user) {
      const path = user.picture?.path;
      console.log(path);
      if (path) {
        fs.unlinkSync(path);
      }
    }
    if (!user) {
      next(new ErrorWithStatus("User not found", 404));
    }
    res.json({
      success: true,
      message: "Profile picture changed successfully",
      data: user ?? {},
    });
  } catch (error) {
    next(error);
  }
};

export const patch_profile_picture: RequestHandler<
  { user_id: string },
  StandardResponse<number>,
  unknown,
  { action: string }
> = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { action } = req.query;
    if (action !== "deactivate_profile") {
      next(new ErrorWithStatus("Invalid action", 400));
    }

    const user = await UserModel.updateOne(
      { _id: user_id, active: true },
      { $set: { active: false } }
    );
    if (!user) {
      next(new ErrorWithStatus("User not found", 404));
    }

    res.json({
      success: true,
      message: `Your account has been deactivated!`,
      data: user.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};
