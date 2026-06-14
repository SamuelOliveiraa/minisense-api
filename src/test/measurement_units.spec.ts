import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import supertest, { type Response } from "supertest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../database/client.ts";
import { app } from "../app.ts";
import { measurementUnits } from "@/database/schema.ts";

describe("Measurement Units routes", () => {
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.delete(measurementUnits);
  });

  describe("POST", () => {
    it("should be able to create a new measurement unit", async () => {
      const response: Response = await supertest(app.server)
        .post("/measurement-units")
        .send({
          symbol: "ºC",
          description: "Celsius"
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          symbol: "ºC",
          description: "Celsius"
        })
      );
    });

    it("should return 400 when missing fields", async () => {
      await supertest(app.server)
        .post("/measurement-units")
        .send({
          symbol: "ºC"
        })
        .expect(400);

      await supertest(app.server)
        .post("/measurement-units")
        .send({ description: "Celsius" })
        .expect(400);
    });
  });

  describe("GET", () => {
    it("should be able to list all measurement units as a plain array", async () => {
      await supertest(app.server)
        .post("/measurement-units")
        .send({
          symbol: "ºC",
          description: "Celsius"
        })
        .expect(201);

      const response: Response = await supertest(app.server)
        .get("/measurement-units")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].symbol).toBe("ºC");
    });

    it("should be able to get a measurement unit by id", async () => {
      const createResponse = await supertest(app.server)
        .post("/measurement-units")
        .send({
          symbol: "%",
          description: "Percent"
        })
        .expect(201);

      expect(createResponse.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          symbol: "%",
          description: "Percent"
        })
      );

      const unitId = createResponse.body.id;

      const response = await supertest(app.server)
        .get(`/measurement-units/${unitId}`)
        .expect(200);

      expect(response.body.symbol).toBe("%");
    });

    it("should return 404 for a non-existing measurement unit id", async () => {
      const nonExistingId = "00000000-0000-0000-0000-000000000000";

      const response = await supertest(app.server)
        .get(`/measurement-units/${nonExistingId}`)
        .expect(404);

      expect(response.body.message).toBe("Measurement unit not found");
    });
  });

  describe("PUT", () => {
    it("should be able to update a measurement unit", async () => {
      const createResponse = await supertest(app.server)
        .post("/measurement-units")
        .send({
          symbol: "hpa",
          description: "wrong desc"
        })
        .expect(201);

      const unitId = createResponse.body.id;

      const response = await supertest(app.server)
        .put(`/measurement-units/${unitId}`)
        .send({
          symbol: "hPA",
          description: "hectopasca"
        })
        .expect(200);

      expect(response.body.symbol).toBe("hPA");
      expect(response.body.description).toBe("hectopasca");
    });

    it("should return 400 when missing fields on update", async () => {
      const someId = "00000000-0000-0000-0000-000000000000";

      await supertest(app.server)
        .put(`/measurement-units/${someId}`)
        .send({ symbol: "KG" })
        .expect(400);

      await supertest(app.server)
        .put(`/measurement-units/${someId}`)
        .send({ description: "Kilogram" })
        .expect(400);
    });

    it("should return 404 when updating a non-existing measurement unit", async () => {
      const nonExistingId = "00000000-0000-0000-0000-000000000000";

      const response = await supertest(app.server)
        .put(`/measurement-units/${nonExistingId}`)
        .send({
          symbol: "KG",
          description: "Kilogram"
        })
        .expect(404);

      expect(response.body.message).toBe("Measurement unit not found");
    });
  });

  describe("DELETE", () => {
    it("should be able to delete a measurement unit", async () => {
      const createResponse = await supertest(app.server)
        .post("/measurement-units")
        .send({
          symbol: "lux",
          description: "Lux"
        })
        .expect(201);

      const unitId = createResponse.body.id;

      await supertest(app.server)
        .delete(`/measurement-units/${unitId}`)
        .expect(204);

      await supertest(app.server)
        .get(`/measurement-units/${unitId}`)
        .expect(404);
    });

    it("should return 404 when trying to delete a non-existing measurement unit", async () => {
      const nonExistingId = "00000000-0000-0000-0000-000000000000";

      const response = await supertest(app.server)
        .delete(`/measurement-units/${nonExistingId}`)
        .expect(404);

      expect(response.body.message).toBe("Measurement unit not found");
    });
  });
});
