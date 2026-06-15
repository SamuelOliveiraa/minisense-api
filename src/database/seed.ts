import { db } from "./client.js";
import {
  users,
  measurementUnits,
  sensorDevices,
  dataStreams,
  sensorData
} from "./schema.js";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Limpar banco (opcional, remova se quiser manter o que já tem)
  await db.delete(sensorData);
  await db.delete(dataStreams);
  await db.delete(sensorDevices);
  await db.delete(users);
  await db.delete(measurementUnits);

  // 2. Criar Usuário
  const [user] = await db
    .insert(users)
    .values({
      username: "Oliveira Admin",
      email: "admin@minisense.com"
    })
    .returning();

  console.log("✅ User created");

  // 3. Criar Unidades
  const units = await db
    .insert(measurementUnits)
    .values([
      { symbol: "ºC", description: "Celsius" },
      { symbol: "%", description: "Percentage" },
      { symbol: "Lux", description: "Luminosity" }
    ])
    .returning();

  console.log("✅ Units created");

  // 4. Criar Dispositivo
  const [device] = await db
    .insert(sensorDevices)
    .values({
      label: "Estação Meteorológica Sala",
      description: "ESP32 com sensores DHT22 e LDR",
      userId: user.id
    })
    .returning();

  console.log("✅ Device created");

  // 5. Criar Streams
  const [tempStream] = await db
    .insert(dataStreams)
    .values({
      label: "Temperatura",
      deviceId: device.id,
      unitId: units[0].id // ºC
    })
    .returning();

  const [humiStream] = await db
    .insert(dataStreams)
    .values({
      label: "Umidade",
      deviceId: device.id,
      unitId: units[1].id // %
    })
    .returning();

  console.log("✅ Streams created");

  // 6. Gerar dados aleatórios (últimas 24 horas, de hora em hora)
  const measurements = [];
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < 24; i++) {
    const timestamp = now - i * 3600;

    // Dados de Temperatura (20-30 graus)
    measurements.push({
      streamId: tempStream.id,
      value: 20 + Math.random() * 10,
      timestamp
    });

    // Dados de Umidade (40-60%)
    measurements.push({
      streamId: humiStream.id,
      value: 40 + Math.random() * 20,
      timestamp
    });
  }

  await db.insert(sensorData).values(measurements);

  console.log("✅ Random sensor data generated");
  console.log("🚀 Database seeded successfully!");

  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
