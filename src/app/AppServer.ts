import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { IProxifier } from "./proxifiers/index";

export default class AppServer {
    private server: Server;

    constructor(private proxifier: IProxifier, private port: number) {
        const server: Server = createServer(this._onRequest.bind(this));
        this.server = server;
    }

    public start(): void {
        this.server.listen(this.port);
    }

    private async _onRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
        const { body, response } = await this.proxifier.proxyRequest(req, res);
        response.end(body);
    }
}
