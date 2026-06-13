import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  type ZodTypeProvider
} from "fastify-type-provider-zod";
import usersRoute from "./routes/users/index.ts";
import measurementUnitsRoute from "./routes/measurement_units/index.ts";
import sensorDeviceRoute from "./routes/sensor_devices/index.ts";
import sensorDataRoute from "./routes/sensor_data/index.ts";
import dataStreamsRoute from "./routes/data_streams/index.ts";
import { env } from "./env/index.ts";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const app = fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>();

// if (env.NODE_ENV === "dev") {
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Minisense API",
      version: "1.0.1"
    }
  },
  transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
// }

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

app.register(sensorDataRoute, {
  prefix: "/sensor-data"
});

app.register(dataStreamsRoute, {
  prefix: "/data-streams"
});
