import type {
  MeasurementUnit,
  MeasurementUnitPost
} from "@/database/types/measurement-unit.js";
import { env } from "@/env/index.js";
import { MeasurementUnitModel } from "@/model/MeasurementUnitModel.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export class MeasurementUnitController {
  #model: MeasurementUnitModel;

  constructor() {
    this.#model = new MeasurementUnitModel();
  }

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const measurementsUnits = await this.#model.index();

      return reply.send(measurementsUnits);
    } catch (error) {
      if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };

  create = async (
    request: FastifyRequest<{ Body: MeasurementUnitPost }>,
    reply: FastifyReply
  ) => {
    try {
      const { symbol, description } = request.body;

      if (!symbol || !description)
        return reply
          .status(400)
          .send({ message: "Symbol or description is required" });

      const measurementUnit = await this.#model.create(request.body);

      if (!measurementUnit)
        return reply
          .status(500)
          .send({ message: "Error to create a measurement unit" });

      return reply.status(201).send(measurementUnit);
    } catch (error) {
      if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };

  findById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      if (!id)
        return reply
          .status(400)
          .send({ message: "Id of measurement unit is required" });

      const measurementUnit = await this.#model.findById(id);

      if (!measurementUnit)
        return reply
          .status(404)
          .send({ message: "Measurement unit not found" });

      return reply.send(measurementUnit);
    } catch (error) {
      if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      if (!id)
        return reply
          .status(400)
          .send({ message: "Id of measurement unit is required" });

      const deletedMeasurement = await this.#model.delete(id);

      if (!deletedMeasurement)
        return reply
          .status(404)
          .send({ message: "Measurement unit not found" });

      return reply.status(204).send();
    } catch (error) {
      if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: MeasurementUnitPost;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      if (!id)
        return reply
          .status(400)
          .send({ message: "Id of measurement unit is required" });

      const { description, symbol } = request.body;

      if (!description || !symbol)
        return reply
          .status(400)
          .send({ message: "Description and symbol are required" });

      const updatedMeasurementUnit = await this.#model.update(id, {
        description,
        symbol
      });

      if (!updatedMeasurementUnit)
        return reply
          .status(404)
          .send({ message: "Measurement unit not found" });

      return reply.send(updatedMeasurementUnit);
    } catch (error) {
      if (env.NODE_ENV === "test") console.error(error);
      throw error;
    }
  };
}
