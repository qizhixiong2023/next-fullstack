import { created, handleApiError, ok } from "@/lib/api-response";
import { createProjectSchema } from "@/modules/projects/projects.schema";
import {
  createProject,
  listProjects,
} from "@/modules/projects/projects.service";

export async function GET() {
  try {
    const projects = await listProjects();
    return ok(projects);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createProjectSchema.parse(body);
    const project = await createProject(input);

    return created(project);
  } catch (error) {
    return handleApiError(error);
  }
}
