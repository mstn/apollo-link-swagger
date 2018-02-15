import loadSwaggerSchema from '../loadSwaggerSchema';
import swaggerSchemaMock from './mocks/swaggerSchema';

const nock = require('nock');

describe('loadSwaggerSchema', () => {

  const baseUrl = 'https://example.com';

  it('loads a swagger schema from url', async () => {
    nock(baseUrl)
      .get('/swagger.json')
      .reply(200, swaggerSchemaMock);
    const schema = await loadSwaggerSchema(`${baseUrl}/swagger.json`);
    expect(schema).toMatchObject(swaggerSchemaMock);
  });
});
