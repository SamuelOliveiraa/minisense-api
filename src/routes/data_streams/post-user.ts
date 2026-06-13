import type { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postDataStreamRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.post(
    "",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Create a Data Stream",
        description:
          "This route creates a data stream in the data_streams table on the database.",
        response: {
          200: z.object({
            id: z.uuid(),
            name: z.string().min(2).max(100),
            description: z.string().min(2).max(100)
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
