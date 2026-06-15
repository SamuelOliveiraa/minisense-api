import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import supertest, { type Response } from "supertest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../database/client";
import { app } from "../app";
import {
  dataStreams,
  sensorDevices,
  users,
  measurementUnits
} from "@/database/schema";

describe("Data Streams routes", () => {
  let deviceKey: string;
  let unitId: string;

  beforeAll(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.delete(dataStreams);
    await db.delete(sensorDevices);
    await db.delete(users);
    await db.delete(measurementUnits);

    const user = await supertest(app.server)
      .post("/users")
      .send({ username: "Owner", email: "owner@example.com" });

    const device = await supertest(app.server)
      .post("/sensor-devices")
      .send({ label: "Device 01", description: "Desc", userId: user.body.id });

    deviceKey = device.body.key;

    const unit = await supertest(app.server)
      .post("/measurement-units")
      .send({ symbol: "ºC", description: "Celsius" });

    unitId = unit.body.id;
  });

  describe("POST", () => {
    it("should be able to create a new data stream for a device", async () => {
      const response: Response = await supertest(app.server)
        .post(`/data-streams/${deviceKey}`)
        .send({
          label: "temperature",
          unitId: unitId
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          key: expect.any(String),
          label: "temperature",
          unitId: unitId,
          enabled: true
        })
      );
    });

    it("should return 400 when missing label or unitId", async () => {
      await supertest(app.server)
        .post(`/data-streams/${deviceKey}`)
        .send({ label: "temp" })
        .expect(400);

      await supertest(app.server)
        .post(`/data-streams/${deviceKey}`)
        .send({ unitId: unitId })
        .expect(400);
    });

    it("should return 404 when device key or unitId does not exist", async () => {
      const fakeKey = "00000000-0000-0000-0000-000000000000";

      await supertest(app.server)
        .post(`/data-streams/${fakeKey}`)
        .send({ label: "temp", unitId })
        .expect(404);

      await supertest(app.server)
        .post(`/data-streams/${deviceKey}`)
        .send({ label: "temp", unitId: fakeKey })
        .expect(404);
    });
  });

  describe("GET", () => {
    it("should be able to list all data streams as a plain array", async () => {
      await supertest(app.server)
        .post(`/data-streams/${deviceKey}`)
        .send({ label: "stream 1", unitId })
        .expect(201);

      const response: Response = await supertest(app.server)
        .get("/data-streams")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });

    it("should be able to get a data stream by key with measurements and id", async () => {
      const createResponse = await supertest(app.server)
        .post(`/data-streams/${deviceKey}`)
        .send({ label: "detailed stream", unitId })
        .expect(201);

      const streamKey = createResponse.body.key;

      const response = await supertest(app.server)
        .get(`/data-streams/${streamKey}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: createResponse.body.id,
          key: streamKey,
          label: "detailed stream",
          measurements: expect.any(Array),
          measurementCount: expect.any(Number)
        })
      );
    });

    it("should return 404 for non-existing stream key", async () => {
      const fakeKey = "00000000-0000-0000-0000-000000000000";
      const response = await supertest(app.server)
        .get(`/data-streams/${fakeKey}`)
        .expect(404);

      expect(response.body.message).toBe("Data Stream not found");
    });
  });
});
