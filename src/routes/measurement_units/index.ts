import type { FastifyInstance } from "fastify";
import { MeasurementUnitController } from "@/controllers/MeasurementUnitController";
import { getMeasurementUnitsRoute } from "./get-measurement-unit";
import { postMeasurementUnitRoute } from "./post-measurement-unit";
import { getMeasurementUnitByIdRoute } from "./get-measurement-unit-by-id";
import { deleteMeasurementUnitRoute } from "./delete-measurement-unit";
import { updateMeasurementUnitRoute } from "./update-measurement-unit";

export default async function measurementUnitsRoute(app: FastifyInstance) {
  const controller = new MeasurementUnitController();

  await getMeasurementUnitsRoute(app, controller);
  await postMeasurementUnitRoute(app, controller);
  await getMeasurementUnitByIdRoute(app, controller);
  await deleteMeasurementUnitRoute(app, controller);
  await updateMeasurementUnitRoute(app, controller);
}
