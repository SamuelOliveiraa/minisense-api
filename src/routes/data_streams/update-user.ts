import type { UserController } from "@/controllers/UserController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const updateUserRoute = async (
  app: FastifyInstance,
  controller: UserController
) => {
  app.put(
    "/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Update a User",
        description:
          "This route updates a user in the users table on the database.",
        response: {
          200: z.object({
            id: z.string(),
            username: z.string().min(2).max(100),
            email: z.email()
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
        params: z.object({
          id: z.string()
        }),
        body: z.object({
          username: z.string().min(2).max(100),
          email: z.email()
        })
      }
    },
    controller.update
  );
};
