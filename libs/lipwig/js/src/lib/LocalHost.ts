import { HostEvents, RoomConfig, SERVER_HOST_EVENT, HOST_EVENT, ServerClientEvents, ServerHostEvents, SERVER_CLIENT_EVENT } from "@whc/lipwig/model";
import { Host } from "./Host";
import { generateString } from '@whc/utils';
import { v4 } from 'uuid';
import * as Logger from 'loglevel';

// TODO: Once the event to register a LocalClient with the server is implemented, that may make all of these much simpler
export class LocalHost extends Host{
    protected override name = 'LocalHost';
    constructor(public override config: RoomConfig = {}) {
        super('', config);

        const code = generateString(4);
        const id = v4();

        // 100ms delay to allow time for listeners
        setTimeout(() => {
            this.handle({
                event: SERVER_HOST_EVENT.CREATED,
                data: {
                    code,
                    id
                }
            });
        }, 100);
    }

    public override send(message: HostEvents.Event) {
        switch (message.event) {
            case HOST_EVENT.MESSAGE:
                for (const id of message.data.recipients) {
                    this.sendToClient(id, {
                        event: SERVER_CLIENT_EVENT.MESSAGE,
                        data: {
                            event: message.data.event,
                            args: message.data.args
                        }
                    });
                }
                break;
        }
    }

    private sendToClient(id: string, message: ServerClientEvents.Event) {
        Logger.debug(`[${this.name}] Sending '${message.event}'`);
        const client = this.getLocalClient(id);

        if (!client) {
            console.warn('Could not find', id);
            return;
        }

        // Convert to string and back to prevent references being passed + simulate server
        client.handle(JSON.parse(JSON.stringify(message)));
    }

    public override close(reason?: string) {

    }

    public override handle(message: ServerHostEvents.Event) {
        super.handle(message);
    }
}
