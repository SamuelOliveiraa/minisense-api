import type { FastifyInstance } from "fastify";
import { MeasurementUnitController } from "@/controllers/MeasurementUnitController.ts";
import { getMeasurementUnitsRoute } from "./get-measurement-unit.ts";
import { postMeasurementUnitRoute } from "./post-measurement-unit.ts";
import { getMeasurementUnitByIdRoute } from "./get-measurement-unit-by-id.ts";
import { deleteMeasurementUnitRoute } from "./delete-measurement-unit.ts";
import { updateMeasurementUnitRoute } from "./update-measurement-unit.ts";

export default async function measurementUnitsRoute(app: FastifyInstance) {
  const controller = new MeasurementUnitController();

  await getMeasurementUnitsRoute(app, controller);
  await postMeasurementUnitRoute(app, controller);
  await getMeasurementUnitByIdRoute(app, controller);
  await deleteMeasurementUnitRoute(app, controller);
  await updateMeasurementUnitRoute(app, controller);
}
