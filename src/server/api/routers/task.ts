import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        projectId: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
          status: "TODO",
          tags: input.tags,
          priority: input.priority ?? "LOW",
          startDate: input.startDate ?? new Date(),
          endDate: input.endDate ?? new Date(),
          createdBy: ctx.session.user.id.toString() ?? "", // <-- fixed here
          createdAt: new Date(),
        } as Prisma.TaskUncheckedCreateInput,
      });
    }),

  assignTaskToUser: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskAndUser.create({
        data: {
          taskId: input.taskId,
          userId: input.userId,
        },
      });
    }),

  removeAssigneeFromTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskAndUser.delete({
        where: {
          taskId_userId: {
            taskId: input.taskId,
            userId: input.userId,
          },
        },
      });
    }),

  getTasksByProjectId: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          projectId: input.projectId,
        },
      });
    }),

  getTaskById: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findUnique({
        where: {
          id: input.taskId,
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
        taskId: z.string(),
        title: z.string().min(1),
        description: z.string(),
        tags: z.array(z.string()),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          priority: input.priority ?? "LOW",
          startDate: input.startDate ?? new Date(),
          endDate: input.endDate ?? new Date(),
        } as Prisma.TaskUncheckedUpdateInput,
      });
    }),

  deleteTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: {
          id: input.taskId,
        },
      });
    }),

  getTasksByStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          status: input.status,
        },
      });
    }),
});
