import { db } from "../database/client.js";
import {
  users,
  measurementUnits,
  sensorDevices,
  dataStreams,
  sensorData
} from "../database/schema.js";

export async function resetDatabase() {
  await db.delete(sensorData);
  await db.delete(dataStreams);
  await db.delete(sensorDevices);
  await db.delete(users);
  await db.delete(measurementUnits);
}
