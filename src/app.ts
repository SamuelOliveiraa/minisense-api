import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from "fastify-type-provider-zod";

export const app = fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>();

app.register(cors);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
