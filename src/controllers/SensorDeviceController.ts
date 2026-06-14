import type { SensorDevicePost } from "@/database/types/sensor-device.ts";
import { DataStreamModel } from "@/model/DataStreamModel.ts";
import { SensorDataModel } from "@/model/SensorDataModel.ts";
import { SensorDeviceModel } from "@/model/SensorDeviceModel.ts";
import { UserModel } from "@/model/UserModel.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export class SensorDeviceController {
  #model: SensorDeviceModel;
  #dataStreamModel: DataStreamModel;
  #sensorDataModel: SensorDataModel;
  #userModel: UserModel;

  constructor() {
    this.#model = new SensorDeviceModel();
    this.#dataStreamModel = new DataStreamModel();
    this.#sensorDataModel = new SensorDataModel();
    this.#userModel = new UserModel();
  }

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const sensorDevices = await this.#model.index();

      const devicesWithStreams = await Promise.all(
        sensorDevices.map(async sensorDevice => {
          const streams = await this.buildStreamsResponse(sensorDevice.id);

          return {
            ...sensorDevice,
            streams
          };
        })
      );

      return reply.send(devicesWithStreams);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  findByUserId = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = request.params;

      if (!userId) {
        return reply.status(400).send({ message: "User ID is required" });
      }

      const sensorDevices = await this.#model.findByUserId(userId);

      const devicesWithStreams = await Promise.all(
        sensorDevices.map(async sensorDevice => {
          const streams = await this.buildStreamsResponse(sensorDevice.id);

          return {
            ...sensorDevice,
            streams
          };
        })
      );

      return reply.send(devicesWithStreams);
    } catch (error) {
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

      if (!label || !userId || !description) {
        return reply
          .status(400)
          .send({ message: "Label, userId, and description are required" });
      }

      const user = await this.#userModel.findById(userId);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const newSensorDevice = await this.#model.create({
        label,
        description,
        userId
      });

      if (!newSensorDevice) {
        return reply
          .status(500)
          .send({ message: "Failed to create sensor device" });
      }

      return reply.status(201).send(newSensorDevice);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  findById = async (
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

      const streams = await this.buildStreamsResponse(sensorDevice.id, true);

      return reply.send({ ...sensorDevice, streams });
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

  private async buildStreamsResponse(
    deviceId: string,
    includeMeasurements: boolean = false
  ) {
    const streams = await this.#dataStreamModel.findByDeviceId(deviceId);

    return Promise.all(
      streams.map(async stream => {
        const measurementCount = await this.#sensorDataModel.countByStreamId(
          stream.id
        );

        if (!includeMeasurements) return { ...stream, measurementCount };

        const measurements = await this.#sensorDataModel.findLatestByStreamId(
          stream.id,
          5
        );

        return {
          ...stream,
          measurementCount,
          measurements: measurements.map(measurement => ({
            timestamp: measurement.timestamp,
            value: measurement.value
          }))
        };
      })
    );
  }
}
