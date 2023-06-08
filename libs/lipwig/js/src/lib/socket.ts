import { ClientEvent } from "@whc/lipwig/types";

export function sendMessage(socket: WebSocket, message: ClientEvent) {
    //TODO: Add in contingency system for messages sent during a disconnection
    //CONT: A queue of messages to be sent in bulk on resumption of connection
    if (message.event === CLIENT_EVENT.MESSAGE) {
        if (message.data.sender.length === 0) {
            message.data.sender = this.id;
        }
    }
    console.log(message);
    socket.send(JSON.stringify(message));
}
