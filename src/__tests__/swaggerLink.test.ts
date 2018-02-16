import { SwaggerLink, createSwaggerLink } from '../swaggerLink';

import { execute } from 'apollo-link';

import { SchemaLink } from 'apollo-link-schema';

import gql from 'graphql-tag';

import schema from './mocks/swaggerSchema';

const nock = require('nock');

describe('createSwaggerLink', () => {

  it('creates an ApolloLink', async () => {
    const link = await createSwaggerLink({ schema }) as SchemaLink;
    expect( link ).toBeDefined();
    expect( link.schema ).toBeDefined();
    expect( link.context ).toMatchObject({
      GQLProxyBaseUrl: 'https://example.com/api'
    });
  });

});

describe('SwaggerLink', () => {

  const sampleQueryRestMock = {
    hello: 'Hello World!'
  };

  const sampleQuery = gql`
    query SampleQuery {
      viewer {
        getSample(id: 1) {
          hello
        }
      }
    }
  `;

  it('correctly receives the constructor arguments', () => {
    const link = new SwaggerLink({ schema });
    expect(link.schema).toEqual(schema);
  });

  it('returns query result and then complete', (done) => {

    nock(`https://${schema.host}`)
      .get('/sample')
      .query({id:'1'})
      .reply(200, sampleQueryRestMock);

    const next = (result: any) => expect( result ).toMatchObject({
      data: {
        viewer: {
          getSample: {
            hello: 'Hello World!'
          }
        }
      }
    });

    const link = new SwaggerLink({ schema });

    const observable = execute(link, {
      query: sampleQuery,
    });
    observable.subscribe({
      next,
      error: error => expect(false),
      complete: done,
    });
  });

});
