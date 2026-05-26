import { NotFoundError } from "@/core/utils/errors";
import { usersRepository } from "./users.repository";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "./users.schema";
import type { User } from "@/db/schema";

export class UsersService {
  async listUsers(): Promise<User[]> {
    return usersRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return usersRepository.create({
      name: input.name,
      age: input.age,
      bio: input.bio ?? null,
    });
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const user = await usersRepository.update(id, {
      name: input.name,
      age: input.age,
      bio: input.bio === undefined ? undefined : input.bio,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await usersRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError("User not found");
    }
  }
}

// Singleton instance
export const usersService = new UsersService();
