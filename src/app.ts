import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import usersRoute from "./routes/users/index.ts";

export const app = fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>();

app.register(cors);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(usersRoute, {
  prefix: "/users"
});
