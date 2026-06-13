import type { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const updateDataStreamRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.put(
    "/:id",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Update a Data Stream",
        description:
          "This route updates a data stream in the data_streams table on the database.",
        response: {
          200: z.object({
            id: z.uuid(),
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
          id: z.uuid()
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
