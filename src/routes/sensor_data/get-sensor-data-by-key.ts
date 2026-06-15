import type { SensorDataController } from "@/controllers/SensorDataController";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getSensorDataByKeyRoute = async (
  app: FastifyInstance,
  controller: SensorDataController
) => {
  app.get(
    "/:key",
    {
      schema: {
        tags: ["sensor_data"],
        summary: "Get a Sensor Data by Key",
        description:
          "This route gets a sensor data from the sensor_data table on the database by their key.",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                timestamp: z.number(),
                value: z.number(),
                streamId: z.uuid()
              })
            )
            .describe("Gives a list of sensor data by the stream key"),
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
        })
      }
    },
    controller.findByStreamKey
  );
};
