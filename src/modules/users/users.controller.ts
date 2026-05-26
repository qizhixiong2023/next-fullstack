import { created, noContent, ok } from "@/core/utils/response";
import {
  createUserSchema,
  userIdSchema,
  updateUserSchema,
} from "./users.schema";
import { usersService } from "./users.service";

export class UsersController {
  async list() {
    const users = await usersService.listUsers();
    return ok(users);
  }

  async getById(id: string) {
    const validatedId = userIdSchema.parse(id);
    const user = await usersService.getUserById(validatedId);
    return ok(user);
  }

  async create(body: unknown) {
    const input = createUserSchema.parse(body);
    const user = await usersService.createUser(input);
    return created(user);
  }

  async update(id: string, body: unknown) {
    const validatedId = userIdSchema.parse(id);
    const input = updateUserSchema.parse(body);
    const user = await usersService.updateUser(validatedId, input);
    return ok(user);
  }

  async delete(id: string) {
    const validatedId = userIdSchema.parse(id);
    await usersService.deleteUser(validatedId);
    return noContent();
  }
}

// Singleton instance
export const usersController = new UsersController();
