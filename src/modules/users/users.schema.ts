import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  age: z.number().int().min(1).max(150),
  bio: z.string().max(500).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.number().int().min(1).max(150).optional(),
  bio: z.string().max(500).optional(),
});

export const userIdSchema = z.string().uuid();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
