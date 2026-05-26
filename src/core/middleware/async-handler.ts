import { NextResponse } from "next/server";
import { handleError } from "./error-handler";

type AsyncRouteHandler<T = unknown> = (
  request: Request,
  context: T,
) => Promise<NextResponse>;

/**
 * Wraps async route handlers with automatic error handling
 */
export function asyncHandler<T = unknown>(
  handler: AsyncRouteHandler<T>,
): (request: Request, context: T) => Promise<NextResponse> {
  return async (request: Request, context: T) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
