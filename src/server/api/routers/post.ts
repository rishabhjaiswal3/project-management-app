import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      try {
        return { greeting: `Hello ${input.text}` };
      } catch (error) {
        console.error("Error in hello procedure:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to process request" });
      }
    }),
});
