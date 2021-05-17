import {SSLSchema} from './Http_methods';

export interface EndpointProtocol {
  schema?: SSLSchema;
  hostUrl?: string;
  path: string;
  queries?: URLQueryItem[];
  url(): string;
}

//https://adyen.thomasjacobs.dev/app.json
export class EndPoint implements EndpointProtocol {
  queries: URLQueryItem[] = [];
  schema: SSLSchema = SSLSchema.https;
  hostUrl: string = 'adyen.thomasjacobs.dev';
  path: string = '';
  constructor({
    schema,
    hosturl,
    path,
    queries,
  }: {
    schema?: SSLSchema;
    hosturl?: string;
    path: string;
    queries: URLQueryItem[];
  }) {
    this.schema = schema ?? SSLSchema.https;
    this.hostUrl = hosturl ?? 'adyen.thomasjacobs.dev';
    this.path = path;
    this.queries = queries;
  }

  url(): string {
    let urlQuery: string = '';
    this.queries.forEach(query => {
      urlQuery += '?' + query.name + '=' + query.value;
    });
    const urlS: string =
      this.schema.toString() +
      '://' +
      this.hostUrl +
      '/' +
      this.path +
      urlQuery;
    return urlS;
  }
}

export type URLQueryItem = {
  name: string;
  value: string;
};
