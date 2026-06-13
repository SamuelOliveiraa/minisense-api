import type { UserController } from "@/controllers/UserController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getUsersByIdRoute = async (
  app: FastifyInstance,
  controller: UserController
) => {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Get a User by ID",
        description:
          "This route gets a user from the users table on the database by their ID.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              username: z.string(),
              email: z.email().min(2).max(100)
            })
            .describe("Gives a user by their ID"),
          404: z
            .object({
              message: z.string()
            })
            .describe("Returned when the user is not found"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          id: z.uuid().describe("The unique identifier (UUID) of the user")
        })
      }
    },
    controller.findById
  );
};
