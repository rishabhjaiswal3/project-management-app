import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export enum ProjectStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

export const projectRouter = createTRPCRouter({

    createProject: protectedProcedure.input(
        z.object({
          title: z.string().min(1),
          description: z.string(),
          status: z.string().optional(),
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
              status: input.status ?? ProjectStatus.PENDING, // Always sets to "TODO"
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
          id: z.string().nonempty("Project ID is required"),
          title: z.string().min(1, "Title is required"),
          description: z.string(),
          status:  z.string().optional(),
          members: z.array(z.string()).optional(),
        })
      ).mutation(async ({ ctx, input }) => {
        const { id, members, ...projectData } = input;
      
        console.log(" updateProject input", );
        // Ensure the user is authorized to update the project
        const project = await ctx.db.project.findUnique({
          where: { id },
        });
      
        if (!project) {
          throw new Error("Project not found.");
        }
      
        if (project.ownedBy !== ctx.session?.user?.id) {
          throw new Error("You are not authorized to update this project.");
        }
      
        const data = {
          ...projectData,
          updatedAt: new Date(),
        }
        // Update the project
        const updatedProject = await ctx.db.project.update({
          where: { id },
          data: data,
        });
      
        // Update team members if provided
        if (members) {
          await ctx.db.projectAndTeam.deleteMany({
            where: { projectId: id },
          });
      
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
        const projects = await ctx.db.project.findMany({
          include: {
            teamMembers: {
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
        });
      
        return projects;
        // return projects.map((project) => ({
        //   ...project,
        //   teamMembers: project.teamMembers.map((teamMember) => teamMember.user),
        // }));
      }),
      deleteProject: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const { db, session } = ctx;
      
        // Ensure the user is authorized to delete the project
        const project = await db.project.findUnique({
          where: {
            id: input, // `input` is the project ID
          },
        });
      
        if (!project) {
          throw new Error("Project not found.");
        }
      
        if (project.ownedBy !== session?.user?.id) {
          throw new Error("You are not authorized to delete this project.");
        }
      
        // Delete the project
        return db.project.delete({
          where: {
            id: input,
          },
        });
      }),
});
