> An ApolloLink for Swagger 2.0 REST endpoints (PoW).

# Apollo Link Swagger (experimental)

[Swagger](https://swagger.io/) is a popular framework for documenting and defining REST APIs.

This package allows you to use GraphQL with any REST endpoint that has or could have a Swagger spec.

You do not need a GraphQL server: GraphQL queries are translated into REST queries on the fly directly in your browser.

This could be useful if you want to migrate your system from REST to GraphQL or if you want to use the goodies of the GraphQL ecosystem with a traditional backend.

A getting started example:

```js
import {
  SwaggerLink,
  SwaggerSchema
} from 'apollo-link-swagger';

import { execute } from 'apollo-link';

import gql from 'graphql-tag';

// json object shaped as a Swagger schema
const schema: SwaggerSchema = { ... };

// build a link
const link = new SwaggerLink({ schema });

// execute GraphQL queries against Swagger endpoints
// the query is translated into an http request
// i.e. GET https://example.com/sample?id=1
execute(link, {
  query: gql`
    query SampleQuery {
      viewer {
        getSample(id: 1) {
          hello
        }
      }
    }
  `
});
```

## Alternative and similar projects

You can use [apollo-link-rest](https://github.com/apollographql/apollo-link-rest). The logic for mapping GraphQL queries to REST is defined by special query directives.

While apollo-link-rest might be more useful when you mix data from REST and other datasources, with apollo-link-swagger you do not have to annotate GraphQL queries.

## Help wanted!

This package is only a proof of work. We need your help to build a solid package! Get in touch.

## Credits

Under the hood we use [apollo-link-schema](https://www.npmjs.com/package/apollo-link-schema) and
[swagger-to-graphql](https://github.com/yarax/swagger-to-graphql) (where the hard work is done).
