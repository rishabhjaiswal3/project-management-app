import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

enum TaskStatus {
  TODO = "TODO",
  INPROCESS = "INPROCESS",
  COMPLETED = "COMPLETED",
}
export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      projectId: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
      status: z
        .enum(Object.values(TaskStatus) as [TaskStatus, ...TaskStatus[]])
        .optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      selectedUsers: z.array(z.string()).optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Await the task creation
    const task = await ctx.db.task.create({
      data: {
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        status: input.status ?? "TODO",
        tags: input.tags,
        priority: input.priority ?? "LOW",
        startDate: input.startDate ?? new Date(),
        endDate: input.endDate ?? new Date(),
        createdBy: ctx.session.user.id.toString() ?? "",
        createdAt: new Date(),
      } as Prisma.TaskUncheckedCreateInput,
    });

    // Handle assigning users to the task
    if (input.selectedUsers && input.selectedUsers.length > 0) {
      const taskAssignees = input.selectedUsers.map((userId: string) => ({
        taskId: task.id, // Use the resolved task ID
        userId,
      }));

      await ctx.db.taskAndUser.createMany({
        data: taskAssignees,
      });
    }

    return task;
  }),
  assignTaskToUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskAndUser.create({
        data: {
          taskId: input.id,
          userId: input.userId,
        },
      });
    }),

  removeAssigneeFromTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskAndUser.delete({
        where: {
          taskId_userId: {
            taskId: input.id,
            userId: input.userId,
          },
        },
      });
    }),
  getTaskById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getTasksByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.taskAndUser.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          task: true,
        },
      });
    }),
    updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string(),
        tags: z.array(z.string()),
        status: z
          .enum(Object.values(TaskStatus) as [TaskStatus, ...TaskStatus[]])
          .optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        selectedUsers: z.array(z.string()).optional(), // Add selectedUsers to the input
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update the task details
      const updatedTask = await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          priority: input.priority ?? "LOW",
          status: input.status ?? "TODO",
          startDate: input.startDate ?? new Date(),
          endDate: input.endDate ?? new Date(),
        } as Prisma.TaskUncheckedUpdateInput,
      });
  
      // Handle updating task assignees if selectedUsers is provided
      if (input.selectedUsers) {
        // Remove existing assignees for the task
        await ctx.db.taskAndUser.deleteMany({
          where: {
            taskId: input.id,
          },
        });
  
        // Add new assignees
        if (input.selectedUsers.length > 0) {
          const taskAssignees = input.selectedUsers.map((userId: string) => ({
            taskId: input.id,
            userId,
          }));
  
          await ctx.db.taskAndUser.createMany({
            data: taskAssignees,
          });
        }
      }
  
      return updatedTask;
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getTasksByStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(["TODO", "INPROCESS", "COMPLETED"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          status: input.status ?? "TODO",
        },
      });
    }),
  getTasksByProjectId: publicProcedure
    .input(z.string().nonempty("Project ID is required"))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.db.task.findMany({
        where: { projectId: input },
        include: {
          assignees: {
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

      return tasks;
    }),
});
