import type { MeasurementUnitController } from "@/controllers/MeasurementUnitController";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const getMeasurementUnitsRoute = async (
  app: FastifyInstance,
  controller: MeasurementUnitController
) => {
  app.get(
    "",
    {
      schema: {
        tags: ["measurement_units"],
        summary: "Get all Measurement Units",
        description:
          "This route gets all measurement units from the measurement_units table on the database.",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                symbol: z.string(),
                description: z.string().min(2).max(100)
              })
            )
            .describe("Gives an array of measurement units"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Returned when an unexpected server error occurs")
        }
      }
    },
    controller.index
  );
};
