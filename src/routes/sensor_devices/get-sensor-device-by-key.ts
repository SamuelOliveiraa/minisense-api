import type { SensorDeviceController } from "@/controllers/SensorDeviceController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getSensorDeviceByKeyRoute = async (
  app: FastifyInstance,
  controller: SensorDeviceController
) => {
  app.get(
    "/key/:key",
    {
      schema: {
        tags: ["sensor_devices"],
        summary: "Get a Sensor Device by Key",
        description:
          "This route gets a sensor device from the sensor_devices table on the database by its key, including its data streams and latest measurements.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              key: z.uuid(),
              label: z.string(),
              description: z.string(),
              userId: z.uuid(),
              streams: z.array(
                z.object({
                  id: z.uuid(),
                  key: z.uuid(),
                  label: z.string(),
                  enabled: z.boolean(),
                  unitId: z.uuid(),
                  deviceId: z.uuid(),
                  measurementCount: z.number(),
                  measurements: z.array(
                    z.object({
                      timestamp: z.number(),
                      value: z.number()
                    })
                  )
                })
              )
            })
            .describe("Gives a sensor device by its key"),
          404: z
            .object({
              message: z.string()
            })
            .describe("Returned when the sensor device is not found"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          key: z
            .string()
            .uuid()
            .describe("The unique key (UUID) of the sensor device")
        })
      }
    },
    controller.findByKey
  );
};
