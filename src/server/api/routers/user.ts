import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  signup: publicProcedure.input(
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })
  ).mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const existingUser = await db.user.findUnique({
      where: { email: input.email },
    });
  
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }
  
    const hashedPassword = await bcrypt.hash(input.password, 10);
  
    const newUser = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      } as Prisma.UserUncheckedCreateInput,
    });
  
    // DO NOT call signIn here
  
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }),

  updateProfile: protectedProcedure.input(
    z.object({
      name: z.string().optional(),
      password: z.string().min(6).optional(),
      image: z.string().url().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    if (!session.user.id) {
      throw new Error("User not authenticated");
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: input.name,
        image: input.image,
        password: input.password
      },
    });

    return { id: updatedUser.id, name: updatedUser.name, image: updatedUser.image };
  }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    if (!session.user.id) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),
  getUsersBySearchString: protectedProcedure
  .input(
    z.object({
      searchString: z.string().optional(),     
  })
  )
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: input.searchString, mode: "insensitive" } }, // Search by name
          { email: { contains: input.searchString, mode: "insensitive" } }, // Search by email
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return users;
  }),
});
