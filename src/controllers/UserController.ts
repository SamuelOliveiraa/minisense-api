import type { UserPost } from "@/database/types/user.ts";
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

      return reply.send(users);
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

      if (!username || !email)
        return reply
          .status(400)
          .send({ message: "Username or email is required" });

      const existingUser = await this.#model.findByEmail(email);

      if (existingUser)
        return reply.status(400).send({ message: "E-mail already exists" });

      const newUser = await this.#model.create({ username, email });

      if (!newUser) {
        return reply.status(500).send({ message: "Error to create a user" });
      }

      return reply.status(201).send(newUser);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
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
        return reply.status(400).send({ message: "Id of user is required" });

      const user = await this.#model.findById(id);

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
      const { id } = request.params;

      if (!id)
        return reply.status(400).send({ message: "Id of user is required" });

      const deletedUser = await this.#model.delete(id);

      if (!deletedUser)
        return reply.status(404).send({ message: "User not found" });

      return reply.status(204).send();
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UserPost;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      if (!id)
        return reply.status(400).send({ message: "Id of user is required" });

      const { username, email } = request.body;

      if (!username || !email)
        return reply
          .status(400)
          .send({ message: "Username and email are required" });

      const existingUser = await this.#model.findByEmail(email);

      if (existingUser && existingUser.id !== id)
        return reply.status(400).send({ message: "E-mail already exists" });

      const updatedUser = await this.#model.update(id, {
        username,
        email
      });

      if (!updatedUser)
        return reply.status(404).send({ message: "User not found" });

      return reply.send(updatedUser);
    } catch (error) {
      // if (env.NODE_ENV === "test") console.error(error);
      console.error(error);
      throw error;
    }
  };
}
