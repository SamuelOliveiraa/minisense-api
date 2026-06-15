import type { SensorDeviceController } from "@/controllers/SensorDeviceController.js";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postSensorDeviceRoute = async (
  app: FastifyInstance,
  controller: SensorDeviceController
) => {
  app.post(
    "",
    {
      schema: {
        tags: ["sensor_devices"],
        summary: "Create a Sensor Device",
        description:
          "This route creates a sensor device in the sensor_devices table on the database.",
        response: {
          201: z.object({
            id: z.uuid(),
            key: z.uuid(),
            label: z.string().min(2).max(100),
            description: z.string().min(1).max(100),
            userId: z.uuid()
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
            .describe("Returned when the user is not found"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        body: z.object({
          label: z.string().min(2).max(100),
          description: z.string().min(1).max(100),
          userId: z.uuid()
        })
      }
    },
    controller.create
  );
};
