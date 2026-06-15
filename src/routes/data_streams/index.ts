import { DataStreamController } from "@/controllers/DataStreamController";
import type { FastifyInstance } from "fastify";
import { getDataStreamByKeyRoute } from "./get-data-stream-by-key";
import { getDataStreamsRoute } from "./get-data-streams";
import { postDataStreamRoute } from "./post-data-stream";

export default async function dataStreamsRoute(app: FastifyInstance) {
  const controller = new DataStreamController();

  await getDataStreamByKeyRoute(app, controller);
  await getDataStreamsRoute(app, controller);
  await postDataStreamRoute(app, controller);
}
