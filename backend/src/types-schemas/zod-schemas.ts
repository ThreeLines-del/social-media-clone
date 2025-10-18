import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const UserRegisterSchema = UserLoginSchema.extend({
  username: z.string().min(1, "Username is required"),
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.url("Invalid avatar URL").optional(),
});

export const PostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.url("Invalid image URL").optional(),
});

export const CommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  postId: z.string(),
});

export const UpdateProfileSchema = UserRegisterSchema.omit({
  username: true,
  email: true,
  password: true,
});
