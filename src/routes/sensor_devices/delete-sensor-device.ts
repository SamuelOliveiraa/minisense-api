import type { SensorDeviceController } from "@/controllers/SensorDeviceController.js";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const deleteSensorDeviceRoute = async (
  app: FastifyInstance,
  controller: SensorDeviceController
) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["sensor_devices"],
        summary: "Delete a Sensor Device",
        description:
          "This route deletes a sensor device from the sensor_devices table on the database.",
        response: {
          204: z
            .object({})
            .describe(
              "Returned when the sensor device is successfully deleted"
            ),
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
          id: z.uuid()
        })
      }
    },
    controller.delete
  );
};
