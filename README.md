# @ginterdev/endpoints

> Useful TypeScript types and utils for axios fetching

## Warning :warning:

**For now I am just experimenting.**

This package makes some assumptions:

- you are using **axios** (^0.21)

## Installation

```bash
yarn add @ginterdev/endpoints

# or

npm i @ginterdev/endpoints
```

## Examples

Let's define types for our API. For simplicity there's two endpoints only.

```ts
type Endpoints {
  'POST /companies': {
    body: {
      name: string;
    };
    response: {
      success: boolean;
    };
  };

  'GET /companies': {
    query?: {
      searchPhrase?: string;
    };
    response: {
      success: boolean,
      companies: {
        id: string;
        name: string;
      };
    };
  };

  'GET /company/{id}': {
    params: {
      id: string;
    };
    response: {
      success: boolean,
      company: {
        id: string;
        name: string;
      };
    };
  };
};
```

### Calling a request

To have all the typechecking in place for our endpoints we just wrap a fetcher (currently only `axios` instance is supported) with a `forEndpoints`. From now on we can execute requests with a guarantee that all required things are passed correctly.

```ts
import axios from 'axios';
import { forEndpoints } from '@ginterdev/endpoints';

const request = forEndpoints<Endpoints>(axios.create());

// execute a request:
request('GET /companies', {
  query: {
    searchPhrase: 'github',
  },
});

// URL params are automatically injected:
request('GET /companies/{id}', {
  params: {
    id: 'foobar',
  },
});
```

### Extracting types

Now we can easily extract types of specific properties for each endpoint:

<!-- prettier-ignore -->
```ts
import { EndpointOptions, EndpointProp } from '@ginterdev/endpoints';

type EndpointUrl = keyof Endpoints;

type Options<Url extends EndpointUrl> = EndpointOptions<Endpoints, Url>;
type Body<Url extends EndpointUrl> = EndpointProp<Endpoints, Url, 'body'>;
type Params<Url extends EndpointUrl> = EndpointProp<Endpoints, Url, 'params'>;
type Query<Url extends EndpointUrl> = EndpointProp<Endpoints, Url, 'query'>;
type Response<Url extends EndpointUrl> = EndpointProp<Endpoints, Url, 'response'>;

type CreateCompanyBody = Body<'POST /companies'>;
// { name: string }

type CreateCompanyResponse = Response<'POST /companies'>;
// { success: true }

type GetCompaniesQuery = Query<'GET /companies'>;
// { searchPhrase?: string }

type GetCompanyParams = Params<'GET /companies/{id}'>;
// { id: string }
```

<!-- prettier-ignore -->
