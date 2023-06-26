export class JSDeck<T> {
    private cards: T[];
    private position = 0;
    private cardOrder: number[];
    constructor(cards: T[] = []) {
        this.cards = cards;
    }

    public add(card: T, count = 1) {
        let i: number;
        for (i = 0; i < count; i++) {
            this.cards.push(card);
        }
    }

    public size(): number {
        return this.cards.length;
    }

    public remaining(): number {
        return this.size() - this.position;
    }

    public shuffle(): void {
        this.cards = this.shuffleArray(this.cards);
        this.position = 0;
    }

    public shuffleRemaining(): void {
        let remaining = this.cards.slice(this.position);
        remaining = this.shuffleArray(remaining);

        let i;
        for (i = 0; i < remaining.length; i++) {
            this.cards[this.position + i] = remaining[i];
        }
    }

    private shuffleArray(arr: T[]): T[] {
        arr = arr.slice(); // Clone array
        const ret = [];
        let value;
        let rand;
        while (arr.length > 0) {
            rand = Math.random() * arr.length;
            rand = Math.floor(rand);
            value = arr.splice(rand, 1);
            ret.push(value[0]);
        }
        return ret;
    }

    public draw(count?: number): T | T[] | null | null[]{
        let i;

        if (!count) {
            let card = null;
            if (this.position < this.cards.length) {
                card = this.cards[this.position];
                this.position++;
            }

            return card;
        }

        const cards: T[] | null[] = [];
        for (i = 0; i < count; i++) {
            cards.push(this.draw()); // TODO: Finish this
        }

        return cards;
    }

    public reset() {
        this.position = 0;
    }
}
