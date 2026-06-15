import { SensorDeviceController } from "@/controllers/SensorDeviceController";
import type { FastifyInstance } from "fastify";
import { getSensorDevicesRoute } from "./get-sensor-devices";
import { getSensorDeviceByKeyRoute } from "./get-sensor-device-by-key";
import { postSensorDeviceRoute } from "./post-sensor-device";
import { deleteSensorDeviceRoute } from "./delete-sensor-device";
import { getSensorDeviceByIdRoute } from "./get-sensor-device-by-id";
import { getSensorDevicesByUserRoute } from "./get-sensor-devices-by-user";

export default async function sensorDevicesRoute(app: FastifyInstance) {
  const controller = new SensorDeviceController();

  await getSensorDevicesRoute(app, controller);
  await getSensorDeviceByKeyRoute(app, controller);
  await getSensorDevicesByUserRoute(app, controller);
  await postSensorDeviceRoute(app, controller);
  await deleteSensorDeviceRoute(app, controller);
  await getSensorDeviceByIdRoute(app, controller);
}
