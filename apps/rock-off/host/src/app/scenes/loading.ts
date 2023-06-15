import { Scene } from "./scene";

export class LoadingScene extends Scene {
    constructor() {
        super({key: 'Loading'});
    }

    create() {
        const loading = this.add.text(this.width / 2, this.height / 2, 'Loading...', {
            align: 'center',
            fontFamily: 'arial',
            fontSize: '20vh',
            color: 'black'
        });
        loading.x -= loading.displayWidth / 2;
        loading.y -= loading.displayHeight / 2;
    }
}
