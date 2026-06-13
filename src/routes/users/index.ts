import { UserController } from "@/controllers/UserController.ts";
import type { FastifyInstance } from "fastify";
import { getUsersRoute } from "./get-users.ts";
import { postUserRoute } from "./post-user.ts";
import { deleteUserRoute } from "./delete-user.ts";
import { getUsersByIdRoute } from "./get-users-by-id.ts";
import { updateUserRoute } from "./update-user.ts";

export default async function usersRoute(app: FastifyInstance) {
  const controller = new UserController();

  await getUsersRoute(app, controller);
  await postUserRoute(app, controller);
  await deleteUserRoute(app, controller);
  await getUsersByIdRoute(app, controller);
  await updateUserRoute(app, controller);
}
