import type { UserController } from "@/controllers/UserController";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postUserRoute = async (
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
          201: z
            .object({
              id: z.uuid(),
              username: z.string().min(2).max(100),
              email: z.email().min(2).max(100)
            })
            .describe("Returned when the user is successfully created"),
          400: z
            .object({
              message: z.string()
            })
            .describe(
              "Returned when username or email is missing, or email already exists"
            ),
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
