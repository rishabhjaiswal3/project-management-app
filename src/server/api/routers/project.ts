import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({

    createProject: publicProcedure.input(
        z.object({
          title: z.string().min(1),
          description: z.string(),
          status: z.string(),
        })
      ).mutation(async ({ ctx, input }) => {
        try {
            console.log('Received input for creating project:', input); // Log the input data

          const { db, session } = ctx;
      
      
          const newProject = await db.project.create({
            data: {
              title: input.title,
              description: input.description,
              status: "TODO", // Always sets to "TODO"
              ownedBy: session?.user.id || null, // Set foreign key
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Prisma.ProjectUncheckedCreateInput,
          });
      
          console.log('Project created successfully:', newProject); // Log success message
      
          return newProject;
      
        } catch (error) {
          console.error('Error occurred while creating project:', error); // Log detailed error information
          throw new Error("Failed to create project");
        }
      }),
      
    updateProject: publicProcedure.input(
        z.object({
            id: z.string(),
            title: z.string().min(1),
            description: z.string(),
            status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
        }),
    ).mutation(async ({ ctx, input }) => {
        return ctx.db.project.update({
            where: {
                id: input.id,
            },
            data: {
                title: input.title,
                description: input.description,
                startDate: input.startDate ?? new Date(),
                endDate: input.endDate ?? new Date(),
            } as Prisma.ProjectUncheckedUpdateInput,
        });
    }),
    getAllProjects: publicProcedure.query(async ({ ctx }) => {
        // console.log("my ctx ",ctx.session.user.id);
        return ctx.db.project.findMany({}) ?? [];
    }),
    getProjectById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        return ctx.db.project.findUnique({
            where: {
                id: input,
            },
        });
    }
    ),
    deleteProject: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        return ctx.db.project.delete({
            where: {
                id: input,
            },
        });
    })
});
