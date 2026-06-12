import { DataStreamModel } from "@/model/DataStream.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export class DataStreamController {
  #model: DataStreamModel;

  constructor() {
    this.#model = new DataStreamModel();
  }

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dataStreams = await this.#model.index();

      return reply.send({ data_streams: dataStreams });
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

      if (!id)
        return reply.status(400).send({ message: "Id of data stream is invalid" });

      const dataStream = await this.#model.findByID(id);

      if (!dataStream) return reply.status(404).send({ message: "Data Stream not found" });

      return reply.send(dataStream);
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

      if (!key)
        return reply.status(400).send({ message: "Key of data stream is invalid" });

      const dataStream = await this.#model.findByKey(key);

      if (!dataStream) return reply.status(404).send({ message: "Data Stream not found" });

      return reply.send(dataStream);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };
}