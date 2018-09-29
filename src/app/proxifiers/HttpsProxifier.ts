import { IncomingMessage, ServerResponse } from "http";
import * as https from "https";
import * as url from "url";

export default class HttpsProxifier {
    constructor(public resourceURL: string) {}

    public proxyRequest(incomingRequest: IncomingMessage, response: ServerResponse):
                        Promise<{ body: Buffer|string, response: ServerResponse }> {
        const outcommingRequestObject = this.proxyRequestObject(incomingRequest);

        return new Promise((resolve) => {
            const request = https.request(outcommingRequestObject, (remoteResponse) => {

                const { headers: remoteHeaders } = remoteResponse;
                Object.keys(remoteHeaders).forEach((headerName) => {
                    const headerValue = remoteHeaders[headerName];

                    if (headerValue !== undefined) {
                        response.setHeader(headerName, headerValue);
                    }
                });

                const data: Buffer[] = [];
                remoteResponse.on("data", (chunk) => data.push(chunk));

                remoteResponse.on("end", () => resolve({ body: Buffer.concat(data), response}));
            });

            request.on("error", ({message: errMessage}) => {
                resolve({body: errMessage, response});
            });

            request.end();
        });
    }

    private proxyRequestObject(incomingRequest: IncomingMessage): {} {
        const { headers, method, url: urlRequest } = incomingRequest;
        const { hostname, protocol } = url.parse(this.resourceURL);
        const { pathname } = urlRequest ? url.parse(urlRequest) : { pathname: "/" };

        const newHeaders = {
            ...headers,
            "accept-encoding": "*",
            // TODO Спросить "почему?", если разрешат:
            // Сей хак связан с тем, что при передаче оригинального заголовка вся кодировка слетала.
            "host": hostname,
        };

        return {
            headers: newHeaders,
            hostname, method, path: pathname, pathname, protocol };
    }
}
