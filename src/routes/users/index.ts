import { UserController } from "@/controllers/UserController.js";
import type { FastifyInstance } from "fastify";
import { getUsersRoute } from "./get-users.js";
import { postUserRoute } from "./post-user.js";
import { deleteUserRoute } from "./delete-user.js";
import { getUsersByIdRoute } from "./get-users-by-id.js";
import { updateUserRoute } from "./update-user.js";

export default async function usersRoute(app: FastifyInstance) {
  const controller = new UserController();

  await getUsersRoute(app, controller);
  await postUserRoute(app, controller);
  await deleteUserRoute(app, controller);
  await getUsersByIdRoute(app, controller);
  await updateUserRoute(app, controller);
}
