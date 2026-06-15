import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import supertest, { type Response } from "supertest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../database/client.js";
import { app } from "../app.js";
import {
  sensorData,
  dataStreams,
  sensorDevices,
  users,
  measurementUnits
} from "@/database/schema.js";

describe("Sensor Data routes", () => {
  let streamKey: string;

  beforeAll(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.delete(sensorData);
    await db.delete(dataStreams);
    await db.delete(sensorDevices);
    await db.delete(users);
    await db.delete(measurementUnits);

    const user = await supertest(app.server)
      .post("/users")
      .send({ username: "Data Owner", email: "data@example.com" });

    const device = await supertest(app.server).post("/sensor-devices").send({
      label: "Device Data",
      description: "Desc",
      userId: user.body.id
    });

    const unit = await supertest(app.server)
      .post("/measurement-units")
      .send({ symbol: "ºC", description: "Celsius" });

    const stream = await supertest(app.server)
      .post(`/data-streams/${device.body.key}`)
      .send({ label: "temp_stream", unitId: unit.body.id });

    streamKey = stream.body.key;
  });

  describe("POST", () => {
    it("should be able to post a new measurement to a stream", async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const response: Response = await supertest(app.server)
        .post(`/sensor-data/${streamKey}`)
        .send({
          timestamp: timestamp,
          value: 25.5
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          timestamp: timestamp,
          value: 25.5,
          streamId: expect.any(String)
        })
      );
    });

    it("should return 400 when missing value or timestamp", async () => {
      await supertest(app.server)
        .post(`/sensor-data/${streamKey}`)
        .send({ value: 10 })
        .expect(400);

      await supertest(app.server)
        .post(`/sensor-data/${streamKey}`)
        .send({ timestamp: 123456 })
        .expect(400);
    });

    it("should return 404 when stream key does not exist", async () => {
      const fakeKey = "00000000-0000-0000-0000-000000000000";
      const response = await supertest(app.server)
        .post(`/sensor-data/${fakeKey}`)
        .send({ timestamp: 123456, value: 10 })
        .expect(404);

      expect(response.body.message).toBe("Stream not found");
    });
  });

  describe("GET", () => {
    it("should be able to get all measurements from a stream as a plain array", async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      await supertest(app.server)
        .post(`/sensor-data/${streamKey}`)
        .send({ timestamp: timestamp, value: 20 })
        .expect(201);

      const response: Response = await supertest(app.server)
        .get(`/sensor-data/${streamKey}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].value).toBe(20);
    });

    it("should return 404 when trying to get data from non-existing stream", async () => {
      const fakeKey = "00000000-0000-0000-0000-000000000000";
      const response = await supertest(app.server)
        .get(`/sensor-data/${fakeKey}`)
        .expect(404);

      expect(response.body.message).toBe("Stream not found");
    });
  });
});
