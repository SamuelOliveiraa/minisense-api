import type { MeasurementUnitController } from "@/controllers/MeasurementUnitController";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getMeasurementUnitByIdRoute = async (
  app: FastifyInstance,
  controller: MeasurementUnitController
) => {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["measurement_units"],
        summary: "Get a Measurement Unit by ID",
        description:
          "This route gets a measurement unit from the measurement_units table on the database by its ID.",
        response: {
          200: z
            .object({
              id: z.uuid(),
              symbol: z.string(),
              description: z.string().min(2).max(100)
            })
            .describe("Gives a measurement unit by their ID"),
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
          id: z
            .uuid()
            .describe("The unique identifier (UUID) of the measurement unit")
        })
      }
    },
    controller.findById
  );
};
