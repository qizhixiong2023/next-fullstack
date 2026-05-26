import { ok } from "@/core/utils/response";

export async function GET() {
  return ok({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
