import type { MeasurementUnitController } from "@/controllers/MeasurementUnitController";
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
          204: z
            .object({})
            .describe(
              "Returned when the measurement unit is successfully deleted"
            ),
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
    controller.delete
  );
};
