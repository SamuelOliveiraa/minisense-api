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
  username: text().notNull(),
  email: text().notNull().unique()
});

export const measurementUnits = pgTable("measurement_units", {
  id: uuid().primaryKey().defaultRandom(),
  symbol: text().notNull().unique(),
  description: text().notNull().unique()
});

export const sensorDevices = pgTable("sensor_devices", {
  id: uuid().primaryKey().defaultRandom(),
  key: uuid().defaultRandom().unique(),
  label: text().notNull(),
  description: text().notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id)
});

export const dataStreams = pgTable("data_streams", {
  id: uuid().primaryKey().defaultRandom(),
  key: uuid().defaultRandom().unique(),
  label: text().notNull().unique(),
  enabled: boolean().notNull().default(true),

  deviceId: uuid("device_id")
    .notNull()
    .references(() => sensorDevices.id),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => measurementUnits.id)
});

export const sensorData = pgTable(
  "sensor_data",
  {
    id: uuid().primaryKey().defaultRandom(),
    timestamp: integer().notNull(),
    value: doublePrecision().notNull(),

    streamId: uuid("stream_id")
      .notNull()
      .references(() => dataStreams.id),
    unitId: uuid("unit_id")
      .notNull()
      .references(() => measurementUnits.id)
  },
  table => ({
    timestampIndex: index("timestamp_index").on(table.timestamp)
  })
);
