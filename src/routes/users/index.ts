import { UserController } from "@/controllers/UserController";
import type { FastifyInstance } from "fastify";
import { getUsersRoute } from "./get-users";
import { postUserRoute } from "./post-user";
import { deleteUserRoute } from "./delete-user";
import { getUsersByIdRoute } from "./get-users-by-id";
import { updateUserRoute } from "./update-user";

export default async function usersRoute(app: FastifyInstance) {
  const controller = new UserController();

  await getUsersRoute(app, controller);
  await postUserRoute(app, controller);
  await deleteUserRoute(app, controller);
  await getUsersByIdRoute(app, controller);
  await updateUserRoute(app, controller);
}
