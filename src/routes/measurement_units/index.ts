import type { FastifyInstance } from "fastify";
import { MeasurementUnitController } from "@/controllers/MeasurementUnitController.js";
import { getMeasurementUnitsRoute } from "./get-measurement-unit.js";
import { postMeasurementUnitRoute } from "./post-measurement-unit.js";
import { getMeasurementUnitByIdRoute } from "./get-measurement-unit-by-id.js";
import { deleteMeasurementUnitRoute } from "./delete-measurement-unit.js";
import { updateMeasurementUnitRoute } from "./update-measurement-unit.js";

export default async function measurementUnitsRoute(app: FastifyInstance) {
  const controller = new MeasurementUnitController();

  await getMeasurementUnitsRoute(app, controller);
  await postMeasurementUnitRoute(app, controller);
  await getMeasurementUnitByIdRoute(app, controller);
  await deleteMeasurementUnitRoute(app, controller);
  await updateMeasurementUnitRoute(app, controller);
}
