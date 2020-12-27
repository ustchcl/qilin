// http.ts
import * as http from "http";
import * as https from "https";
import * as qs from "querystring";

export module network {
    type Uri = string;
    export type RequestType 
        = ["GET", Uri]
        | ["POST_JSON", Uri, qs.ParsedUrlQueryInput]
        | ["POST_FORM", Uri, qs.ParsedUrlQueryInput]
    
    export function mkRequest(type: RequestType) {
        const useHttps = type[1].toLowerCase().startsWith('https');
        switch (type[0]) {
            case "GET": {
                return request(type[1], useHttps, {method: 'GET'});
            }
            case "POST_FORM": {
                return request(type[1], useHttps, {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/x-www-form-urlencoded"
                    }
                }, qs.stringify(type[2]));
            }
            case "POST_JSON": {
                return request(type[1], useHttps, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, qs.stringify(type[2]))
            }
        }
    }

    export type Response = {
        content: string,
        statusCode: number,
        headers: any,
    }

    export async function get(uri: string): Promise<Response> {
        return new Promise<Response>(function(resolve, reject) {
            http.get(uri, res => {
                const response: Response = {
                    content: '',
                    statusCode: res.statusCode as number,
                    headers: JSON.stringify(res.headers),
                };
                res.setEncoding('utf-8');
                res.on('data', _ => response.content += _);
                res.on('end', () => resolve(response));
                res.on('error', reject);
            });
        });
    }

    async function request(uri: string, useHttps: boolean, options: http.RequestOptions, content: string = ""): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            var _request = useHttps ? https.request : http.request;
            const req = _request(uri, options, res => {
                const response: Response = {
                    content: '',
                    statusCode: res.statusCode as number,
                    headers: JSON.stringify(res.headers),
                };
                res.setEncoding('utf-8');
                res.on('data', _ => response.content += _);
                res.on('end', () => resolve(response));
                res.on('error', reject);
            });
            req.write(content);
            req.end();
        })
    }
}