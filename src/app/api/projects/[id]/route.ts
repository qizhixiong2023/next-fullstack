import {
  handleApiError,
  noContent,
  ok,
} from "@/lib/api-response";
import {
  projectIdSchema,
  updateProjectSchema,
} from "@/modules/projects/projects.schema";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/modules/projects/projects.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(projectIdSchema.parse(id));

    return ok(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const project = await updateProject(
      projectIdSchema.parse(id),
      updateProjectSchema.parse(body),
    );

    return ok(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteProject(projectIdSchema.parse(id));

    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
