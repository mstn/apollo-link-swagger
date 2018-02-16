import * as Swagger from 'swagger-schema-official';

export type SwaggerSchema = Swagger.Spec;

export { default as loadSwaggerSchema } from './loadSwaggerSchema';
export * from './swaggerLink';
