import Configuration from "./configuration";
import { Parameter } from "./parameterBuilder";

export interface Headers {
  [index: string]: string;
}

export interface Cookies {
  [index: string]: string;
}

export interface RequestParameters {
  url: string;
  method: string;
  body?: string;
  cookies?: Cookies;
  headers: Headers;
}

export async function request(
  config: Configuration,
  path: string,
  method: string,
  params: Parameter[]
): Promise<any> {
  // replace path parameters with values
  for (const pathParam of params.filter((p) => p.location === "path")) {
    path = path.replace(
      `{${pathParam.name}}`,
      encodeURIComponent(pathParam.value.toString())
    );
  }

  let url =
    (config.basePath ?? "") + config.servers[config.selectedServerIndex] + path;

  // build the query string
  const queryParams = params.filter((p) => p.location === "query");
  if (method === "get" && queryParams.length > 0) {
    url +=
      "?" +
      new URLSearchParams(
        queryParams.map((p) => [p.name, p.value]) as [string, string][]
      );
  }

  // add additional headers
  const additionalHeaders = params
    .filter((p) => p.location === "header")
    .reduce<Headers>((acc, param) => {
      acc[param.name] = param.value;
      return acc;
    }, {});

  // provide a bearer token if required
  if (config.bearerToken) {
    additionalHeaders["Authorization"] = `Bearer ${config.bearerToken}`;
  }

  let requestParams: RequestParameters = {
    url,
    method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
  };

  const bodyParam = params.find((p) => p.location === "body");
  if (bodyParam) {
    requestParams.body = bodyParam.value;
  }

  //add cookie params if they exist
  const cookieParam = params.find((p) => p.location === "cookie");
  if (cookieParam) {
    requestParams.cookies = params
    .filter((p) => p.location === "cookie")
    .reduce<Cookies>((acc, param) => {
      acc[param.name] = param.value;
      return acc;
    }, {});
  }

  return await config.transport(requestParams);
}
