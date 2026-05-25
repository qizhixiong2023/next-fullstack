import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors";

type ApiSuccess<T> = {
  data: T;
};

type ApiFailure = {
  error: {
    message: string;
    details?: unknown;
  };
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(
  message: string,
  status = 500,
  details?: unknown,
) {
  return NextResponse.json<ApiFailure>(
    { error: { message, details } },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Invalid request payload", 400, error.flatten());
  }

  if (error instanceof AppError) {
    return fail(error.message, error.statusCode);
  }

  console.error(error);
  return fail("Internal server error");
}
