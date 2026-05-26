import { asyncHandler } from "@/core/middleware/async-handler";
import { usersController } from "@/modules/users/users.controller";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = asyncHandler(async (_request: Request, context: RouteContext) => {
  const { id } = await context.params;
  return usersController.getById(id);
});

export const PATCH = asyncHandler(async (request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  return usersController.update(id, body);
});

export const DELETE = asyncHandler(async (_request: Request, context: RouteContext) => {
  const { id } = await context.params;
  return usersController.delete(id);
});
