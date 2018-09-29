import AppServer from "./app/AppServer";
import { IProxifier, proxifierList } from "./app/proxifiers/";
import Config from "./Config";

const { targetUrl, proxifierName, port } = Config.getConfig();

const proxifier: IProxifier = new proxifierList[proxifierName](targetUrl);

const server = new AppServer(proxifier, port);
server.start();
