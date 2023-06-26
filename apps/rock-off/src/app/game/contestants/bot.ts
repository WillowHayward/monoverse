import { Move } from "@whc/rock-off/common";
import { Contestant } from "./contestant";
import { BotProfile } from "../../game.model";
import { profiles } from "./bot.profiles";

export class Bot extends Contestant {
    private profile: BotProfile;
    constructor() {
        const profile = Bot.getBotProfile();
        super(profile.name, true);
        this.profile = profile;
    }

    public override getMove(): Promise<Move> {
        this.currentMove = Promise.resolve(this.profile.tactic);
        return this.currentMove;
    }

    private static getBotProfile(): BotProfile {
        return profiles[Math.floor(Math.random() * profiles.length)];
    }
}
