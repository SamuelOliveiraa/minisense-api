import type { User, UserPost } from "@/database/types/user.ts";
import { env } from "@/env/index.ts";
import { UserModel } from "@/model/UserModel.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
  #model: UserModel;

  constructor() {
    this.#model = new UserModel();
  }

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await this.#model.index();

      return reply.send({ users });
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  create = async (
    request: FastifyRequest<{
      Body: UserPost;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { username, email } = request.body;
      const newUser = await this.#model.create({ username, email });

      if (!newUser) {
        return reply.status(404).send({ message: "Erro to create a user" });
      }

      return reply.send(newUser);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  show = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const user = await this.#model.show(request.params.id);

      if (!user) return reply.status(404).send({ message: "User not found" });

      return reply.send(user);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const deletedUser = await this.#model.delete(request.params.id);

      if (!deletedUser)
        return reply.status(404).send({ message: "User not found" });

      return reply.send(deletedUser);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };
}
