import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import supertest, { type Response } from "supertest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../database/client";
import { app } from "../app";
import { sensorDevices, users } from "@/database/schema";

describe("Sensor Devices routes", () => {
  let userId: string;

  beforeAll(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.delete(sensorDevices);
    await db.delete(users);

    const userResponse = await supertest(app.server)
      .post("/users")
      .send({
        username: "Device Owner",
        email: "owner@example.com"
      })
      .expect(201);

    userId = userResponse.body.id;
  });

  describe("POST", () => {
    it("should be able to create a new sensor device", async () => {
      const response: Response = await supertest(app.server)
        .post("/sensor-devices")
        .send({
          label: "Sensor 001",
          description: "Kitchen Freezer",
          userId: userId
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          key: expect.any(String),
          label: "Sensor 001",
          description: "Kitchen Freezer",
          userId: userId
        })
      );
    });

    it("should return 400 when missing required fields", async () => {
      await supertest(app.server)
        .post("/sensor-devices")
        .send({ label: "Only Label", userId })
        .expect(400);

      await supertest(app.server)
        .post("/sensor-devices")
        .send({ description: "Only Desc", userId })
        .expect(400);

      await supertest(app.server)
        .post("/sensor-devices")
        .send({ label: "L", description: "D", userId }) // Min length check
        .expect(400);
    });

    it("should return 404 when user does not exist", async () => {
      const fakeUserId = "00000000-0000-0000-0000-000000000000";
      const response = await supertest(app.server)
        .post("/sensor-devices")
        .send({
          label: "Fail Device",
          description: "Fail Desc",
          userId: fakeUserId
        })
        .expect(404);

      expect(response.body.message).toBe("User not found");
    });
  });

  describe("GET", () => {
    it("should be able to list all sensor devices as a plain array", async () => {
      await supertest(app.server)
        .post("/sensor-devices")
        .send({
          label: "Device 1",
          description: "Desc 1",
          userId: userId
        })
        .expect(201);

      const response: Response = await supertest(app.server)
        .get("/sensor-devices")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("streams");
    });

    it("should be able to get a sensor device by key", async () => {
      const createResponse = await supertest(app.server)
        .post("/sensor-devices")
        .send({
          label: "Key Test Device",
          description: "Testing finding by key",
          userId: userId
        })
        .expect(201);

      const deviceKey = createResponse.body.key;

      const response = await supertest(app.server)
        .get(`/sensor-devices/key/${deviceKey}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          key: deviceKey,
          label: "Key Test Device",
          streams: expect.any(Array)
        })
      );
    });

    it("should be able to get sensor devices by user id", async () => {
      await supertest(app.server)
        .post("/sensor-devices")
        .send({
          label: "User Specific Device",
          description: "This belongs to our user",
          userId: userId
        })
        .expect(201);

      const response = await supertest(app.server)
        .get(`/sensor-devices/user/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].userId).toBe(userId);
    });

    it("should return 404 for non-existing device key", async () => {
      const fakeKey = "00000000-0000-0000-0000-000000000000";
      const response = await supertest(app.server)
        .get(`/sensor-devices/key/${fakeKey}`)
        .expect(404);

      expect(response.body.message).toBe("Sensor device not found");
    });
  });

  describe("DELETE", () => {
    it("should be able to delete a sensor device", async () => {
      const createResponse = await supertest(app.server)
        .post("/sensor-devices")
        .send({
          label: "To be deleted",
          description: "Goodbye",
          userId: userId
        })
        .expect(201);

      const deviceId = createResponse.body.id;

      await supertest(app.server)
        .delete(`/sensor-devices/${deviceId}`)
        .expect(204);

      const checkResponse = await supertest(app.server)
        .get("/sensor-devices")
        .expect(200);

      expect(checkResponse.body).toHaveLength(0);
    });

    it("should return 404 when deleting non-existing device", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const response = await supertest(app.server)
        .delete(`/sensor-devices/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("Sensor device not found");
    });
  });
});
