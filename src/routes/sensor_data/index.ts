import { SensorDataController } from "@/controllers/SensorDataController.ts";
import type { FastifyInstance } from "fastify";
import { postSensorDataRoute } from "./post-sensor-data.ts";
import { getSensorDataByKeyRoute } from "./get-sensor-data-by-key.ts";

export default async function sensorDataRoute(app: FastifyInstance) {
  const controller = new SensorDataController();

  await postSensorDataRoute(app, controller);
  await getSensorDataByKeyRoute(app, controller);
}
