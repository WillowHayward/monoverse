import { Camera, Stage } from '@whc/fps';
import { FlatActor } from './FlatActor';

export class Player extends FlatActor {
    private camera: Camera;
    constructor(name: string, scene: Stage) {
        super(name, scene);
        this.camera = this.createCamera();
    }

    public createCamera(): Camera {
        //TODO: For split screen later https://doc.babylonjs.com/how_to/how_to_use_multi-views
        let camera = new Camera(this.scene);

        return camera;
    }
}
