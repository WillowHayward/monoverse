import { Client } from '@whc/lipwig/js';

export class Game {
    constructor(private client: Client, name: string) {
        this.setName(name);
        this.changePage('wait');
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
}
