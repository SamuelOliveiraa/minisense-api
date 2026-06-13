import type { SensorDataPost } from "@/database/types/sensor-data.ts";
import { SensorDataModel } from "@/model/SensorDataModel.ts";
import { DataStreamModel } from "@/model/DataStreamModel.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export class SensorDataController {
  #model: SensorDataModel;
  #dataStreamModel: DataStreamModel;

  constructor() {
    this.#model = new SensorDataModel();
    this.#dataStreamModel = new DataStreamModel();
  }

  findByStreamKey = async (
    request: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { key } = request.params;

      const stream = await this.#dataStreamModel.findByKey(key);

      if (!stream)
        return reply.status(404).send({ message: "Stream not found" });

      const measurements = await this.#model.findByStreamId(stream.id);

      return reply.send(measurements);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  create = async (
    request: FastifyRequest<{ Params: { key: string }; Body: SensorDataPost }>,
    reply: FastifyReply
  ) => {
    try {
      const { key } = request.params;
      const { value, timestamp } = request.body;

      if (value === undefined || !timestamp)
        return reply
          .status(400)
          .send({ message: "Value and timestamp are required" });

      const stream = await this.#dataStreamModel.findByKey(key);

      if (!stream)
        return reply.status(404).send({ message: "Stream not found" });

      const newSensorData = await this.#model.create({
        value,
        timestamp,
        streamId: stream.id
      });

      if (!newSensorData)
        return reply
          .status(500)
          .send({ message: "Failed to create sensor data" });

      return reply.status(201).send(newSensorData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
