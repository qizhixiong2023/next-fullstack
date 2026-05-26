import { NextResponse } from "next/server";
import type { ApiSuccessResponse } from "@/core/types/api";

export function ok<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 200 },
  );
}

export function created<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 },
  );
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
