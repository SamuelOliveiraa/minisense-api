import { DataStreamController } from "@/controllers/DataStreamController.ts";
import type { FastifyInstance } from "fastify";
import { deleteDataStreamRoute } from "./delete-user.ts";
import { getDataStreamByIdRoute } from "./get-users-by-id.ts";
import { getDataStreamsRoute } from "./get-data-streams.ts";

export default async function usersRoute(app: FastifyInstance) {
  const controller = new DataStreamController();

  await deleteDataStreamRoute(app, controller);
  await getDataStreamByIdRoute(app, controller);
  await getDataStreamsRoute(app, controller);
}
