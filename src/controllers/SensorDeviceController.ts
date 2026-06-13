import type { SensorDevicePost } from "@/database/types/sensor-device.ts";
import { SensorDeviceModel } from "@/model/SensorDeviceModel.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export class SensorDeviceController {
  #model: SensorDeviceModel;

  constructor() {
    this.#model = new SensorDeviceModel();
  }

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const sensorDevices = await this.#model.index();

      return reply.send({ sensor_devices: sensorDevices });
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  create = async (
    request: FastifyRequest<{ Body: SensorDevicePost }>,
    reply: FastifyReply
  ) => {
    try {
      const { label, description, userId } = request.body;

      if (!label || !userId || description) {
        return reply
          .status(400)
          .send({ message: "Label, userId, and description are required" });
      }

      const newSensorDevice = await this.#model.create({
        label,
        description,
        userId
      });

      return reply.send(newSensorDevice);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  findByID = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      if (!id) {
        return reply
          .status(400)
          .send({ message: "ID of sensor device is invalid" });
      }

      const sensorDevice = await this.#model.findById(id);

      if (!sensorDevice) {
        return reply.status(404).send({ message: "Sensor device not found" });
      }

      return reply.send(sensorDevice);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  findByKey = async (
    request: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { key } = request.params;

      if (!key) {
        return reply
          .status(400)
          .send({ message: "Key of sensor device is invalid" });
      }

      const sensorDevice = await this.#model.findByKey(key);

      if (!sensorDevice) {
        return reply.status(404).send({ message: "Sensor device not found" });
      }

      return reply.send(sensorDevice);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      if (!id) {
        return reply
          .status(400)
          .send({ message: "ID of sensor device is invalid" });
      }

      const deleteSensorDevice = await this.#model.delete(id);

      if (!deleteSensorDevice) {
        return reply.status(404).send({ message: "Sensor device not found" });
      }

      return reply.status(204).send();
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };
}
