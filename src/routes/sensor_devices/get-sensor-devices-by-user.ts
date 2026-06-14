import type { SensorDeviceController } from "@/controllers/SensorDeviceController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getSensorDevicesByUserRoute = async (
  app: FastifyInstance,
  controller: SensorDeviceController
) => {
  app.get(
    "/user/:userId",
    {
      schema: {
        tags: ["sensor_devices"],
        summary: "Get Sensor Devices by User",
        description:
          "This route gets all sensor devices for a specific user, including their data streams.",
        response: {
          200: z
            .array(
              z.object({
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
                    measurementCount: z.number()
                  })
                )
              })
            )
            .describe("Gives an array of sensor devices for the user"),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() })
        },
        params: z.object({
          userId: z.string().uuid().describe("The UUID of the user")
        })
      }
    },
    controller.findByUserId
  );
};
