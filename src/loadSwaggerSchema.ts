import 'isomorphic-fetch';

import { validate } from 'swagger-parser';

import { SwaggerSchema } from './';

export default async function loadSwaggerSchema(
  url: string,
): Promise<SwaggerSchema> {
  const response = await fetch(url);
  const schema = await response.json();
  return await validate(schema);
}
