import type { SensorDeviceController } from "@/controllers/SensorDeviceController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getSensorDeviceByIdRoute = async (
  app: FastifyInstance,
  controller: SensorDeviceController
) => {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["sensor_devices"],
        summary: "Get a Sensor Device by ID",
        description:
          "This route gets a sensor device from the sensor_devices table on the database by its ID.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              key: z.uuid(),
              label: z.string(),
              description: z.string(),
              userId: z.uuid()
            })
            .describe("Gives a sensor device by its ID"),
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
          id: z
            .string()
            .uuid()
            .describe("The unique identifier (UUID) of the sensor device")
        })
      }
    },
    controller.findById
  );
};
