import type { UserController } from "@/controllers/UserController";
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
          204: z
            .object({})
            .describe("Returned when the user is successfully deleted"),
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
          id: z.uuid()
        })
      }
    },
    controller.delete
  );
};
