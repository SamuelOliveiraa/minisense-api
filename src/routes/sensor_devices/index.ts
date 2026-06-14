import { SensorDeviceController } from "@/controllers/SensorDeviceController.ts";
import type { FastifyInstance } from "fastify";
import { getSensorDevicesRoute } from "./get-sensor-devices.ts";
import { getSensorDeviceByKeyRoute } from "./get-sensor-device-by-key.ts";
import { postSensorDeviceRoute } from "./post-sensor-device.ts";
import { deleteSensorDeviceRoute } from "./delete-sensor-device.ts";
import { getSensorDeviceByIdRoute } from "./get-sensor-device-by-id.ts";
import { getSensorDevicesByUserRoute } from "./get-sensor-devices-by-user.ts";

export default async function sensorDevicesRoute(app: FastifyInstance) {
  const controller = new SensorDeviceController();

  await getSensorDevicesRoute(app, controller);
  await getSensorDeviceByKeyRoute(app, controller);
  await getSensorDevicesByUserRoute(app, controller);
  await postSensorDeviceRoute(app, controller);
  await deleteSensorDeviceRoute(app, controller);
  await getSensorDeviceByIdRoute(app, controller);
}
