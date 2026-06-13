import type { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const deleteDataStreamRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Delete a Data Stream",
        description:
          "This route deletes a data stream from the data_streams table on the database.",
        response: {
          204: z
            .object({})
            .describe("Returned when the data stream is successfully deleted"),
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
        })
      }
    },
    controller.delete
  );
};
