import type { DataStreamPost } from "@/database/types/data-stream.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "@/env/index.ts";
import { DataStreamModel } from "@/model/DataStreamModel.ts";
import { SensorDeviceModel } from "@/model/SensorDeviceModel.ts";
import { SensorDataModel } from "@/model/SensorDataModel.ts";
import { MeasurementUnitModel } from "@/model/MeasurementUnitModel.ts";

export class DataStreamController {
  #model: DataStreamModel;
  #sensorDeviceModel: SensorDeviceModel;
  #sensorDataModel: SensorDataModel;
  #measurementUnitModel: MeasurementUnitModel;

  constructor() {
    this.#model = new DataStreamModel();
    this.#sensorDeviceModel = new SensorDeviceModel();
    this.#sensorDataModel = new SensorDataModel();
    this.#measurementUnitModel = new MeasurementUnitModel();
  }

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dataStreams = await this.#model.index();

      return reply.send({ data_streams: dataStreams });
    } catch (error) {
      if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };

  findByKey = async (
    request: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { key } = request.params;

      if (!key)
        return reply
          .status(400)
          .send({ message: "Key of data stream is invalid" });

      const dataStream = await this.#model.findByKey(key);

      if (!dataStream)
        return reply.status(404).send({ message: "Data Stream not found" });

      const measurements = await this.#sensorDataModel.findLatestByStreamId(
        dataStream.id,
        5
      );

      const measurementCount = await this.#sensorDataModel.countByStreamId(
        dataStream.id
      );

      return reply.send({
        ...dataStream,
        measurementCount,
        measurements
      });
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };

  create = async (
    request: FastifyRequest<{ Params: { key: string }; Body: DataStreamPost }>,
    reply: FastifyReply
  ) => {
    try {
      const { unitId, label } = request.body;
      const { key } = request.params;

      if (!key)
        return reply
          .status(400)
          .send({ message: "Key of data stream is invalid" });

      if (!unitId || !label)
        return reply
          .status(400)
          .send({ message: "Unit ID and label are required" });

      const measurementUnit = await this.#measurementUnitModel.findById(unitId);

      if (!measurementUnit)
        return reply.status(404).send({ message: "Unit ID not found" });

      const sensorDevice = await this.#sensorDeviceModel.findByKey(key);

      if (!sensorDevice)
        return reply.status(404).send({ message: "Sensor Device not found" });

      const dataStream = await this.#model.create({
        unitId,
        label,
        deviceId: sensorDevice.id,
        enabled: true
      });

      if (!dataStream)
        return reply
          .status(500)
          .send({ message: "Failed to create data stream" });

      return reply.status(201).send(dataStream);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };
}
