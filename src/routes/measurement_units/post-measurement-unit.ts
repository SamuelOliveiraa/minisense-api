import type { MeasurementUnitController } from "@/controllers/MeasurementUnitController.ts";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const postMeasurementUnitRoute = async (
  app: FastifyInstance,
  controller: MeasurementUnitController
) => {
  app.post(
    "",
    {
      schema: {
        tags: ["measurement_units"],
        summary: "Create a Measurement Unit",
        description:
          "This route creates a measurement unit in the measurement_units table on the database.",
        response: {
          200: z.object({
            id: z.string(),
            symbol: z.string().min(2).max(100),
            description: z.string().min(2).max(100)
          }),
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
        body: z.object({
          symbol: z.string().min(2).max(100),
          description: z.string().min(2).max(100)
        })
      }
    },
    controller.create
  );
};
