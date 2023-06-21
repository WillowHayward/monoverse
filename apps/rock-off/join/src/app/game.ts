import { Client, Query } from '@whc/lipwig/js';
import { Move } from '@whc/rock-off/common';

export class Game {
    private currentPoll: Query;
    constructor(private client: Client, name: string) {
        this.setName(name);
        this.changePage('wait');
        this.addListeners();
    }

    private changePage(page: string) {
        document.querySelector('.current-page').classList.remove('current-page');
        document.getElementById(page).classList.add('current-page');
    }

    private setName(name: string) {
        const elements = document.querySelectorAll('.name');
        elements.forEach(element => {
            element.textContent = name;
        });
    }

    private addListeners() {
        const buttons = {
            Rock: Move.ROCK,
            Paper: Move.PAPER,
            Scissors: Move.SCISSORS
        }

        for (const btn in buttons) {
            const move = buttons[btn];

            document.getElementById(`btnPlay${btn}`).addEventListener('click', () => {
                this.currentPoll.respond(move);
                this.changePage('wait');
            });;
        }
        this.client.on('poll', query => {
            this.changePage('play');
            this.currentPoll = query;
        });
    }
}
