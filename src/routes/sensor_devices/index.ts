import { SensorDeviceController } from "@/controllers/SensorDeviceController.js";
import type { FastifyInstance } from "fastify";
import { getSensorDevicesRoute } from "./get-sensor-devices.js";
import { getSensorDeviceByKeyRoute } from "./get-sensor-device-by-key.js";
import { postSensorDeviceRoute } from "./post-sensor-device.js";
import { deleteSensorDeviceRoute } from "./delete-sensor-device.js";
import { getSensorDeviceByIdRoute } from "./get-sensor-device-by-id.js";
import { getSensorDevicesByUserRoute } from "./get-sensor-devices-by-user.js";

export default async function sensorDevicesRoute(app: FastifyInstance) {
  const controller = new SensorDeviceController();

  await getSensorDevicesRoute(app, controller);
  await getSensorDeviceByKeyRoute(app, controller);
  await getSensorDevicesByUserRoute(app, controller);
  await postSensorDeviceRoute(app, controller);
  await deleteSensorDeviceRoute(app, controller);
  await getSensorDeviceByIdRoute(app, controller);
}
