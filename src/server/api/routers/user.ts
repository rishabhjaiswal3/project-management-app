import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { signIn } from "next-auth/react"; 

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

    const res = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false, 
    });

    if (res?.error) {
      throw new Error("Failed to sign in");
    }

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  }),
  login: publicProcedure.input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    // Login is handled by NextAuth.js
    const res = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,  // Prevent redirecting, handle manually
    });

    if (res?.error) {
      throw new Error("Invalid credentials");
    }

    return { message: "Login successful" };
  }),

  updateProfile: protectedProcedure.input(
    z.object({
      name: z.string().optional(),
      image: z.string().url().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: input.name,
        image: input.image,
      },
    });

    return { id: updatedUser.id, name: updatedUser.name, image: updatedUser.image };
  }),
});
