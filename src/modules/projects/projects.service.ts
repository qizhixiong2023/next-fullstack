import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { NotFoundError } from "@/lib/errors";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/modules/projects/projects.schema";

export async function listProjects() {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function createProject(input: CreateProjectInput) {
  const [project] = await db
    .insert(projects)
    .values({
      name: input.name,
      description: input.description ?? null,
    })
    .returning();

  return project;
}

export async function getProjectById(id: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  const [project] = await db
    .update(projects)
    .set({
      ...input,
      description:
        input.description === undefined ? undefined : input.description,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
}

export async function deleteProject(id: string) {
  const [project] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  if (!project) {
    throw new NotFoundError("Project not found");
  }
}
