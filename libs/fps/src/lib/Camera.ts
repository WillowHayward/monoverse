import * as BABYLON from 'babylonjs';
import { Actor } from './Actor';
import { Stage } from './Stage';

export class Camera extends BABYLON.UniversalCamera {
    constructor(scene: Stage) {
        const name = 'camera' + scene.cameras.length;
        super(name, BABYLON.Vector3.Zero(), scene);
        this.inertia = 0;
        //this.fov = 2 * Math.PI; //One day...

        const engine = scene.getEngine();
        if (engine) {
            //this.attachControl(engine.getRenderingCanvas() as HTMLCanvasElement, false);
        }

        console.log(name, 'Initialised');
    }

    public tick(delta: number, follow?: Actor) {
        if (follow) {
            if (!this.parent) {
                this.parent = follow.headNode;
            }
            /*const pos = follow.headNode.getAbsolutePosition();
      this.position.set(pos.x, pos.y, pos.z);*/
        }
    }
}
