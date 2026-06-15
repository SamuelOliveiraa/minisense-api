import type { DataStreamController } from "@/controllers/DataStreamController.js";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getDataStreamsRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.get(
    "",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Get all Data Streams",
        description:
          "This route gets all data streams from the data_streams table on the database.",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                key: z.uuid(),
                label: z.string().min(2).max(100),
                enabled: z.boolean(),
                deviceId: z.uuid(),
                unitId: z.uuid()
              })
            )
            .describe("Gives an array of data streams"),
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
        }
      }
    },
    controller.index
  );
};
