import type { MeasurementUnitController } from "@/controllers/MeasurementUnitController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const deleteMeasurementUnitRoute = async (
  app: FastifyInstance,
  controller: MeasurementUnitController
) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["measurement_units"],
        summary: "Delete a Measurement Unit",
        description:
          "This route deletes a measurement unit from the measurement_units table on the database.",
        response: {
          200: z
            .object({
              id: z.string(),
              symbol: z.string().min(2).max(100),
              description: z.string().min(2).max(100)
            })
            .describe("Gives a measurement unit that was deleted"),
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
            .string()
            .describe("The unique identifier (UUID) of the measurement unit")
        })
      }
    },
    controller.delete
  );
};
