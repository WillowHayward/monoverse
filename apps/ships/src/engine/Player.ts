import { Camera, Stage } from '@willhaycode/fps';
import { FlatActor } from './FlatActor';

export class Player extends FlatActor {
    private camera: Camera;
    constructor(name: string, scene: Stage) {
        super(name, scene);
    }
    
    public createCamera(): Camera {
        //TODO: For split screen later https://doc.babylonjs.com/how_to/how_to_use_multi-views
        let camera = new Camera(this.scene);
        this.camera = camera;

        return camera;
    }
}
