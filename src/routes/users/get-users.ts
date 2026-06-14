import type { UserController } from "@/controllers/UserController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getUsersRoute = async (
  app: FastifyInstance,
  controller: UserController
) => {
  app.get(
    "",
    {
      schema: {
        tags: ["users"],
        summary: "Get all Users",
        description:
          "This route gets all users from the users table on the database.",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                username: z.string().min(2).max(100),
                email: z.string().email().min(2).max(100)
              })
            )
            .describe("Gives an array of users"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        }
      }
    },
    controller.index
  );
};
