import { Client } from "./Client";

export class Query {
    constructor(private client: Client, private id: string) { }

    public respond(response: any) {
        this.client.respondToPoll(this.id, response);
    }
}
