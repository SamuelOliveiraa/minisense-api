import type { MeasurementUnitController } from "@/controllers/MeasurementUnitController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const updateMeasurementUnitRoute = async (
  app: FastifyInstance,
  controller: MeasurementUnitController
) => {
  app.put(
    "/:id",
    {
      schema: {
        tags: ["measurement_units"],
        summary: "Update a Measurement Unit",
        description:
          "This route updates a measurement unit in the measurement_units table on the database.",
        response: {
          200: z.object({
            id: z.uuid(),
            symbol: z.string().min(2).max(100),
            description: z.string().min(2).max(100)
          }),
          400: z
            .object({
              message: z.string()
            })
            .describe("Returned when description or symbol are missing"),
          404: z
            .object({
              message: z.string()
            })
            .describe("Returned when the measurement unit is not found"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        },
        params: z.object({
          id: z.uuid()
        }),
        body: z.object({
          symbol: z.string().min(2).max(100),
          description: z.string().min(2).max(100)
        })
      }
    },
    controller.update
  );
};
