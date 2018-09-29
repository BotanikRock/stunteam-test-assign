import * as fs from "fs";
import * as path from "path";

export default class Config {
    public static getConfig() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json")).toString());
    }

    public static getConfigItem(key: string) {
        return Config.getConfig()[key];
    }
}
