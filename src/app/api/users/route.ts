import { asyncHandler } from "@/core/middleware/async-handler";
import { usersController } from "@/modules/users/users.controller";

export const GET = asyncHandler(async () => {
  return usersController.list();
});

export const POST = asyncHandler(async (request: Request) => {
  const body = await request.json();
  return usersController.create(body);
});
