import type { DataStreamController } from "@/controllers/DataStreamController.ts";
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
        tags: ["data_stream"],
        summary: "Get all ",
        description:
          "This route gets all  from the  table on the database.",
        response: {
          200: z.object({
            users: z
              .array(
                z.object({
                  id: z.string(),
                  key: z.string(),
                  label: z.string().min(2).max(100),
                  enabled: z.boolean(),
                  deviceId: z.string(),
                  unitId: z.string(),
                })
              )
              .describe("Gives an array of ")
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
        }
      }
    },
    controller.index
  );
};
