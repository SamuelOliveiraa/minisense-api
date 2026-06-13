import type { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getDataStreamByKeyRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.get(
    "/:key",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Get a Data Stream by Key",
        description:
          "This route gets a data stream from the data_streams table on the database by its key, including latest measurements.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              key: z.uuid(),
              label: z.string(),
              enabled: z.boolean(),
              deviceId: z.uuid(),
              unitId: z.uuid(),
              measurementCount: z.number(),
              measurements: z.array(
                z.object({
                  id: z.uuid(),
                  timestamp: z.number(),
                  value: z.number(),
                  streamId: z.uuid()
                })
              )
            })
            .describe(
              "Gives a data stream by its key with its latest measurements"
            ),
          404: z
            .object({
              message: z.string()
            })
            .describe("Returned when the data stream is not found"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          key: z
            .uuid()
            .describe("The unique identifier (UUID) of the data stream")
        })
      }
    },
    controller.findByKey
  );
};
