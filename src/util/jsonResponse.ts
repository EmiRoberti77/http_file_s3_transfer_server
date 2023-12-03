export interface IJsonResponse {
  statusCode: number;
  body: any;
  headers: any;
}

export class JsonResponse {
  public static httpResponse(statusCode: number, msg: any): IJsonResponse {
    return {
      statusCode,
      body: msg,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
    };
  }

  public static to_Json(response: IJsonResponse) {
    return JSON.stringify(response);
  }
}
