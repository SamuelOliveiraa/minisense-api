import {
  text,
  uuid,
  index,
  integer,
  pgTable,
  boolean,
  doublePrecision
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull().unique(),
  email: text().notNull().unique()
});

export const measurementUnits = pgTable("measurement_units", {
  id: uuid().primaryKey().defaultRandom(),
  symbol: text().notNull().unique(),
  description: text().notNull().unique()
});

export const sensorDevices = pgTable("sensor_devices", {
  id: uuid().primaryKey().defaultRandom(),
  key: uuid().defaultRandom(),
  label: text().notNull().unique(),
  description: text(),

  userId: text("user_id").references(() => users.id)
});

export const dataStreams = pgTable("data_streams", {
  id: uuid().primaryKey().defaultRandom(),
  key: uuid().defaultRandom(),
  deviceId: text("device_id").references(() => sensorDevices.id),
  unitId: text("unit_id").references(() => measurementUnits.id),
  label: text().notNull().unique(),
  enabled: boolean().default(true)
});

export const sensorData = pgTable(
  "sensor_data",
  {
    id: uuid().primaryKey().defaultRandom(),
    streamId: text("stream_id").references(() => dataStreams.id),
    unitId: text("unit_id").references(() => measurementUnits.id),
    timestamp: integer().notNull(),
    value: doublePrecision().notNull()
  },
  table => ({
    timestampIndex: index("timestamp_index").on(table.timestamp)
  })
);
