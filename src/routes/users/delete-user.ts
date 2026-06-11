import type { UserController } from "@/controllers/UserController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const deleteUserRoute = async (
  app: FastifyInstance,
  controller: UserController
) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Delete a User",
        description:
          "This route deletes a user from the users table on the database.",
        response: {
          200: z
            .object({
              id: z.string(),
              username: z.string().min(2).max(100),
              email: z.string().min(2).max(100)
            })
            .describe("Gives a user that was deleted"),
          404: z
            .object({
              message: z.string()
            })
            .describe("Returned when the user provides an invalid property"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          id: z.string()
        })
      }
    },
    controller.delete
  );
};
