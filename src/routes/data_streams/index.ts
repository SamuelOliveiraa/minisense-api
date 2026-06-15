import { DataStreamController } from "@/controllers/DataStreamController.js";
import type { FastifyInstance } from "fastify";
import { getDataStreamByKeyRoute } from "./get-data-stream-by-key.js";
import { getDataStreamsRoute } from "./get-data-streams.js";
import { postDataStreamRoute } from "./post-data-stream.js";

export default async function dataStreamsRoute(app: FastifyInstance) {
  const controller = new DataStreamController();

  await getDataStreamByKeyRoute(app, controller);
  await getDataStreamsRoute(app, controller);
  await postDataStreamRoute(app, controller);
}
