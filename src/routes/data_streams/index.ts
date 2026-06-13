import { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import { getDataStreamByKeyRoute } from "./get-data-stream-by-key.ts";
import { getDataStreamsRoute } from "./get-data-streams.ts";
import { postDataStreamRoute } from "./post-data-stream.ts";

export default async function dataStreamsRoute(app: FastifyInstance) {
  const controller = new DataStreamController();

  await getDataStreamByKeyRoute(app, controller);
  await getDataStreamsRoute(app, controller);
  await postDataStreamRoute(app, controller);
}
