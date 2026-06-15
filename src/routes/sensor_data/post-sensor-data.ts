import type { SensorDataController } from "@/controllers/SensorDataController";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postSensorDataRoute = async (
  app: FastifyInstance,
  controller: SensorDataController
) => {
  app.post(
    "/:key",
    {
      schema: {
        tags: ["sensor_data"],
        summary: "Create Sensor Data",
        description:
          "This route creates sensor data in the sensor_data table on the database.",
        response: {
          201: z.object({
            id: z.uuid(),
            timestamp: z.number(),
            value: z.number(),
            streamId: z.uuid()
          }),
          404: z
            .object({
              message: z.string()
            })
            .describe("Returned when the stream key is not found"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          key: z.string().uuid().describe("The key of the data stream")
        }),
        body: z.object({
          timestamp: z.number(),
          value: z.number()
        })
      }
    },
    controller.create
  );
};
