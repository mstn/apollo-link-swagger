import 'isomorphic-fetch';

import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
} from 'apollo-link';

import { SchemaLink } from 'apollo-link-schema';

import * as urljoin from 'url-join';

import { SwaggerSchema } from './';

// tslint:disable-next-line
const swaggerToGraphQL = require('swagger-to-graphql');

export namespace SwaggerLink {

  export interface Options {
    schema: SwaggerSchema;
  }

}

export async function createSwaggerLink(options: SwaggerLink.Options): Promise<ApolloLink> {
  // TODO return errors if schema has file type
  // see // https://github.com/yarax/swagger-to-graphql/issues/19
  const schema = await swaggerToGraphQL(options.schema);
  const schemes = options.schema.schemes;
  if (schemes && schemes.length > 0) {
    const protocol = schemes.find( scheme => scheme === 'https')
                      || schemes.find( scheme => scheme === 'http');
    if (protocol) {
      const baseUrl = `${protocol}://${options.schema.host}`;
      const path = `${options.schema.basePath}`;
      const GQLProxyBaseUrl = urljoin(baseUrl, path);
      return new SchemaLink({
        schema,
        context: {
          GQLProxyBaseUrl,
        },
      });
    }
  }
  throw new Error(`SwaggerLink supports only https and http protocols. Found: ${schemes}.`);
}

export class SwaggerLink extends ApolloLink {

  public readonly schema: SwaggerSchema;
  private link: Promise<ApolloLink>;

  constructor(options: SwaggerLink.Options) {
    super();
    this.schema = options.schema;

    this.link = createSwaggerLink(options);

  }

  public request(operation: Operation, forward?: NextLink): Observable<any> | null {
    return new Observable(observer => {
      let handle: any;
      this.link
          .then(link => link.request(operation, forward))
          .then(observable => {
            if (observable) {
              handle = observable.subscribe(observer);
            }
            // TODO hadle case when observable is null
          })
          .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    });
  }
}
