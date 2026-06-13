import type { UserController } from "@/controllers/UserController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postUsersRoute = async (
  app: FastifyInstance,
  controller: UserController
) => {
  app.post(
    "",
    {
      schema: {
        tags: ["users"],
        summary: "Create a User",
        description:
          "This route creates a user in the users table on the database.",
        response: {
          200: z.object({
            id: z.uuid(),
            username: z.string().min(2).max(100),
            email: z.email().min(2).max(100)
          }),
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
        body: z.object({
          username: z.string().min(2).max(100),
          email: z.email().min(2).max(100)
        })
      }
    },
    controller.create
  );
};
