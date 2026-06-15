import { SensorDataController } from "@/controllers/SensorDataController";
import type { FastifyInstance } from "fastify";
import { postSensorDataRoute } from "./post-sensor-data";
import { getSensorDataByKeyRoute } from "./get-sensor-data-by-key";

export default async function sensorDataRoute(app: FastifyInstance) {
  const controller = new SensorDataController();

  await postSensorDataRoute(app, controller);
  await getSensorDataByKeyRoute(app, controller);
}
