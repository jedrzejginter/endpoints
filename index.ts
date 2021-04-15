import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

type EndpointShape = Partial<
  Record<'body' | 'params' | 'query' | 'response' | 'responses', any>
>;

type ShapeOfEndpoints = Record<string, EndpointShape>;

type InternalConfig = {
  method: string;
  url: string;
  query?: Record<string, any>;
};

export type EndpointProp<
  Endpoints extends ShapeOfEndpoints,
  Url extends keyof Endpoints,
  K extends keyof EndpointShape
> = Endpoints[Url][K];

export type EndpointOptions<
  Endpoints extends ShapeOfEndpoints,
  Url extends keyof Endpoints
> = Omit<AxiosRequestConfig, 'data' | 'url' | 'method' | 'params'> &
  Omit<Endpoints[Url], 'response' | 'responses'>;

export function forEndpoints<Endpoints extends ShapeOfEndpoints>(
  fetcher: AxiosInstance,
) {
  function request<Url extends keyof Endpoints>(
    urlWithMethod: Url,
    options: EndpointOptions<Endpoints, Url>,
  ): Promise<AxiosResponse<EndpointProp<Endpoints, Url, 'response'>>> {
    const { params, query, ...config } = options;

    const urlChunks = String(urlWithMethod).split(' ');
    const [method = 'GET'] = urlChunks;
    let [, url = ''] = urlChunks;

    if (
      typeof url === 'string' &&
      typeof params === 'object' &&
      params !== null
    ) {
      // replace dynamic params in the url
      url = url.replace(/\{([^}]+)\}/g, (_, param) => String(params[param]));
    }

    const internal: InternalConfig = {
      method,
      url,
      query,
    };

    return fetcher({
      ...config,
      url: internal.url,
      method: internal.method as Method,
      data: options.body,
      params: internal.query,
    });
  }

  return request;
}
