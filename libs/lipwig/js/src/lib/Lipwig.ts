import { RoomConfig } from "@whc/lipwig/types";
import { Host } from "./Host";

export class Lipwig {
    static create(url: string, config: RoomConfig = {}): Promise<Host> {
        return new Promise((resolve, reject) => {
            const host = new Host(url, config);
            host.on('created', (

        });

    }

}
