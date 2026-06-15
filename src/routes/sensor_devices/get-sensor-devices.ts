import type { SensorDeviceController } from "@/controllers/SensorDeviceController.js";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getSensorDevicesRoute = async (
  app: FastifyInstance,
  controller: SensorDeviceController
) => {
  app.get(
    "",
    {
      schema: {
        tags: ["sensor_devices"],
        summary: "Get all Sensor Devices",
        description:
          "This route gets all sensor devices from the sensor_devices table on the database, including their data streams.",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                key: z.uuid(),
                label: z.string().min(2).max(100),
                description: z.string().min(1).max(100),
                userId: z.uuid(),
                streams: z.array(
                  z.object({
                    id: z.uuid(),
                    key: z.uuid(),
                    label: z.string(),
                    enabled: z.boolean(),
                    unitId: z.uuid(),
                    deviceId: z.uuid(),
                    measurementCount: z.number()
                  })
                )
              })
            )
            .describe("Gives an array of sensor devices"),
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
