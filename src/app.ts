import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import usersRoute from "./routes/users/index.ts";
import measurementUnitsRoute from "./routes/measurement_units/index.ts";
import sensorDeviceRoute from "./routes/sensor_devices/index.ts";

export const app = fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>();

app.register(cors);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(usersRoute, {
  prefix: "/users"
});

app.register(measurementUnitsRoute, {
  prefix: "/measurement-units"
});

app.register(sensorDeviceRoute, {
  prefix: "/sensor-devices"
});
