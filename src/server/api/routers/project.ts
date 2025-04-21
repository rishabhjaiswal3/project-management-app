import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({

    createProject: protectedProcedure.input(
        z.object({
          title: z.string().min(1),
          description: z.string(),
          status: z.string(Prisma.ProjectStatus).optional(),
          members: z.array(z.string()).optional(),
        })
      ).mutation(async ({ ctx, input }) => {
        try {

          const { db, session } = ctx;
      
          console.log(`input status ${JSON.stringify(input)}`);
      
          const newProject = await db.project.create({
            data: {
              title: input.title,
              description: input.description,
              status: input.status ?? Prisma.ProjectStatus.PENDING, // Always sets to "TODO"
              ownedBy: session?.user.id || null, // Set foreign key
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Prisma.ProjectUncheckedCreateInput,
          });
  
          if(input?.members?.length) {
            const membersToAdd = input.members.map((memberId) => ({
              userId: memberId,
              projectId: newProject.id,
            }));
      
            await db.projectAndTeam.createMany({
              data: membersToAdd,
            });
          }
          return newProject;
      
        } catch (error) {
          console.error('Error occurred while creating project:', error); // Log detailed error information
          throw new Error("Failed to create project");
        }
      }),
      
      updateProject: protectedProcedure.input(
        z.object({
          id: z.string(),
          title: z.string().min(1),
          description: z.string(),
          status: z.nativeEnum(Prisma.ProjectStatus).optional(),
          members: z.array(z.string()).optional(), // List of user IDs
        })
      ).mutation(async ({ ctx, input }) => {
        const { id, members, ...projectData } = input;
      
        // Update the project
        const updatedProject = await ctx.db.project.update({
          where: {
            id,
          },
          data: {
            ...projectData,
            updatedAt: new Date(),
          },
        });
      
        // Update the teamMembers relation if members are provided
        if (members) {
          // Remove existing team members
          await ctx.db.projectAndTeam.deleteMany({
            where: {
              projectId: id,
            },
          });
      
          // Add new team members
          const membersToAdd = members.map((userId) => ({
            userId,
            projectId: id,
          }));
      
          await ctx.db.projectAndTeam.createMany({
            data: membersToAdd,
          });
        }
      
        return updatedProject;
      }),
      getAllProjects: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.project.findMany({
          include: {
            projectAndTeam: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        }) ?? [];
      }),
    deleteProject: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        return ctx.db.project.delete({
            where: {
                id: input,
                owner: ctx.session?.user?.id,
            },
        });
    })
});
