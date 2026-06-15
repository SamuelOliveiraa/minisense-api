import { SensorDataController } from "@/controllers/SensorDataController.js";
import type { FastifyInstance } from "fastify";
import { postSensorDataRoute } from "./post-sensor-data.js";
import { getSensorDataByKeyRoute } from "./get-sensor-data-by-key.js";

export default async function sensorDataRoute(app: FastifyInstance) {
  const controller = new SensorDataController();

  await postSensorDataRoute(app, controller);
  await getSensorDataByKeyRoute(app, controller);
}
