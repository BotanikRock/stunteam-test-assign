import { IncomingMessage, ServerResponse } from "http";
import HttpsProxifier from "./HttpsProxifier";

// Сделано, чтобы попробовать местные интерфейсы,
// и чтобы в дальнейшем можно было подменять реализацию проксирования.
// Например как сейчас через файл конфига(см. src/Config.js и config.json).

interface IProxifier {
    resourceURL: string;
    proxyRequest: (incomingRequest: IncomingMessage, response: ServerResponse) =>
    Promise<{ body: Buffer|string, response: ServerResponse }>;
}

const proxifierList: { [index: string]: any } = { HttpsProxifier };

export { IProxifier, proxifierList };
