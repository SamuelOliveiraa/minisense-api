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
          "This route gets a sensor device from the sensor_devices table on the database by their ID.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              key: z.uuid(),
              label: z.string().min(2).max(100),
              description: z.string().min(1).max(100),
              userId: z.uuid()
            })
            .describe("Gives a sensor device by their ID"),
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
          id: z
            .uuid()
            .describe("The unique identifier (UUID) of the sensor device")
        })
      }
    },
    controller.findByID
  );
};
