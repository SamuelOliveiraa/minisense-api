import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import supertest, { type Response } from "supertest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../database/client.js";
import { app } from "../app.js";
import { resetDatabase } from "./reset-db.js";

describe("Users routes", () => {
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  describe("POST", () => {
    it("should be able to create a new user", async () => {
      const response: Response = await supertest(app.server)
        .post("/users")
        .send({
          username: "John Doe",
          email: "john@example.com"
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: "John Doe",
          email: "john@example.com"
        })
      );
    });

    it("should not be able to create a user with an existing email", async () => {
      await supertest(app.server)
        .post("/users")
        .send({
          username: "User 1",
          email: "duplicate@example.com"
        })
        .expect(201);

      const response: Response = await supertest(app.server)
        .post("/users")
        .send({
          username: "User 2",
          email: "duplicate@example.com"
        })
        .expect(400);

      expect(response.body).toEqual({
        message: "E-mail already exists"
      });
    });

    it("should return 400 when missing username or email", async () => {
      await supertest(app.server)
        .post("/users")
        .send({ username: "Only name" })
        .expect(400);

      await supertest(app.server)
        .post("/users")
        .send({ email: "only-email@example.com" })
        .expect(400);
    });
  });

  describe("GET", () => {
    it("should be able to list all users as a plain array", async () => {
      await supertest(app.server)
        .post("/users")
        .send({
          username: "User 1",
          email: "user1@example.com"
        })
        .expect(201);

      const response: Response = await supertest(app.server)
        .get("/users")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          username: "User 1"
        })
      );
    });

    it("should be able to get a user by id", async () => {
      const createResponse = await supertest(app.server)
        .post("/users")
        .send({
          username: "John",
          email: "john@example.com"
        })
        .expect(201);

      const userId = createResponse.body.id;

      const response = await supertest(app.server)
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: userId,
          username: "John"
        })
      );
    });

    it("should return 404 for a non-existing user id", async () => {
      const nonExistingId = "00000000-0000-0000-0000-000000000000";
      await supertest(app.server).get(`/users/${nonExistingId}`).expect(404);
    });
  });

  describe("PUT", () => {
    it("should be able to update a user", async () => {
      const createResponse = await supertest(app.server)
        .post("/users")
        .send({
          username: "Old Name",
          email: "old@example.com"
        })
        .expect(201);

      const userId = createResponse.body.id;

      const response = await supertest(app.server)
        .put(`/users/${userId}`)
        .send({
          username: "New Name",
          email: "new@example.com"
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: userId,
          username: "New Name",
          email: "new@example.com"
        })
      );
    });

    it("should return 400 when missing fields on update", async () => {
      const response: Response = await supertest(app.server)
        .post("/users")
        .send({
          username: "John Doe",
          email: "john@example.com"
        })
        .expect(201);

      await supertest(app.server)
        .put(`/users/${response.body.id}`)
        .send({ username: "Email invalid" })
        .expect(400);

      await supertest(app.server)
        .put(`/users/${response.body.id}`)
        .send({ email: "invalid@example.com" })
        .expect(400);
    });

    it("should return 404 when updating a non-existing user", async () => {
      const nonExistingId = "00000000-0000-0000-0000-000000000000";

      const response = await supertest(app.server)
        .put(`/users/${nonExistingId}`)
        .send({ username: "John Doe", email: "john@exists.com" })
        .expect(404);

      expect(response.body.message).toBe("User not found");
    });

    it("should not be able to update email to one that is already taken by another user", async () => {
      const user1 = await supertest(app.server)
        .post("/users")
        .send({ username: "User One", email: "user1@example.com" });

      const user2 = await supertest(app.server)
        .post("/users")
        .send({ username: "User Two", email: "user2@example.com" });

      // Tenta atualizar o usuário 2 usando o email do usuário 1
      const response = await supertest(app.server)
        .put(`/users/${user2.body.id}`)
        .send({
          username: "User Two Updated",
          email: user1.body.email
        })
        .expect(400);

      expect(response.body.message).toBe("E-mail already exists");
    });
  });

  describe("DELETE", () => {
    it("should be able to delete a user", async () => {
      const createResponse = await supertest(app.server)
        .post("/users")
        .send({
          username: "To Delete",
          email: "delete@example.com"
        })
        .expect(201);

      const userId = createResponse.body.id;

      await supertest(app.server).delete(`/users/${userId}`).expect(204);

      await supertest(app.server).get(`/users/${userId}`).expect(404);
    });

    it("should return 404 when trying to delete a non-existing user", async () => {
      const nonExistingId = "00000000-0000-0000-0000-000000000000";

      const response = await supertest(app.server)
        .delete(`/users/${nonExistingId}`)
        .expect(404);

      expect(response.body.message).toBe("User not found");
    });
  });
});
