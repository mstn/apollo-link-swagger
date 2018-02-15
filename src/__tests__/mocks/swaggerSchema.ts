const swaggerSchemaMock = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Sample Swagger'
  },
  host: 'example.com',
  basePath: '/',
  schemes: [
    'https'
  ],
  consumes: [
    'application/json'
  ],
  produces: [
    'application/json'
  ],
  paths: {
    '/sample': {
      get: {
        description: 'sample get',
        operationId: 'getSample',
        produces: [
          'application/json'
        ],
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            type: 'integer',
            format: 'int32'
          }
        ],
        responses: {
          '200': {
            description: 'some sample data.',
            schema: {
              type: 'object',
              required: [
                'name'
              ],
              properties: {
                hello: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerSchemaMock;
