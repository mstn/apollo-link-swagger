import 'isomorphic-fetch';

import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
} from 'apollo-link';

import {
  GraphQLSchema
} from 'graphql';

import { SchemaLink } from "apollo-link-schema";

import { SwaggerSchema } from './';

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
  const GQLProxyBaseUrl = `https://${options.schema.host}`;
  return new SchemaLink({
    schema,
    context: {
      GQLProxyBaseUrl
    }
  });
}

export class SwaggerLink extends ApolloLink {
  private link: Promise<ApolloLink>;
  public readonly schema: SwaggerSchema;

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
