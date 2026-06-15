import type { DataStreamController } from "@/controllers/DataStreamController.js";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postDataStreamRoute = async (
  app: FastifyInstance,
  controller: DataStreamController
) => {
  app.post(
    "/:key",
    {
      schema: {
        tags: ["data_streams"],
        summary: "Create a Data Stream",
        description:
          "This route creates a data stream in the data_streams table on the database for a specific sensor device.",
        response: {
          201: z.object({
            id: z.uuid(),
            key: z.uuid(),
            label: z.string(),
            enabled: z.boolean(),
            deviceId: z.uuid(),
            unitId: z.uuid()
          }),
          400: z
            .object({
              message: z.string()
            })
            .describe("Returned when required fields are missing or invalid"),
          404: z
            .object({
              message: z.string()
            })
            .describe(
              "Returned when the sensor device or measurement unit is not found"
            ),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          key: z.uuid().describe("The key of the sensor device")
        }),
        body: z.object({
          label: z.string().min(2).max(100),
          unitId: z.uuid()
        })
      }
    },
    controller.create
  );
};
