import type { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getDataStreamByIdRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Get a Data Stream by ID",
        description:
          "This route gets a data stream from the data_streams table on the database by its ID.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              name: z.string(),
              description: z.string()
            })
            .describe("Gives a data stream by its ID"),
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
          id: z.uuid().describe("The unique identifier (UUID) of the user")
        })
      }
    },
    controller.findByID
  );
};
