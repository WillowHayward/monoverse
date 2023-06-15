import { HOST_EVENT } from "@whc/lipwig/model";
import { Host } from "./Host";

export class JoinRequest {
    constructor(private host: Host, private id: string) { }

    public approve() {
        this.host.send({
            event: HOST_EVENT.JOIN_RESPONSE,
            data: {
                id: this.id,
                response: true
            }
        });
    }

    public reject(reason?: string) {
        this.host.send({
            event: HOST_EVENT.JOIN_RESPONSE,
            data: {
                id: this.id,
                response: false,
                reason
            }
        });
    }
}
