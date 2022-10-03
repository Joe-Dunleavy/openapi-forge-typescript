import Configuration from "./configuration";
import { Parameter } from "./parameterBuilder";

export interface Headers {
  [index: string]: string;
}

export interface RequestParameters {
  url: string;
  method: string;
  body?: string;
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

  // add cookies to headers
  const cookies = params
  .filter((p) => p.location === "cookie")
  .reduce<Headers>((acc, param, index, array) => {
    acc["cookie"] ??= "";
    acc["cookie"] += `${param.name}=${param.value}`;
    if(index !== array.length - 1){
      acc["cookie"] += ";"
    }
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
      ...cookies,
    },
  };

  const bodyParam = params.find((p) => p.location === "body");
  if (bodyParam) {
    requestParams.body = bodyParam.value;
  }
  
  return await config.transport(requestParams);
}
