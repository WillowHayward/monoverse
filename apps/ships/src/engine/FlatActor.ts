import * as BABYLON from 'babylonjs';
import { Actor, Stage } from '@whc/fps';
export class FlatActor extends Actor {
    constructor(name: string, scene: Stage) {
        super(name, scene);
        const plane = BABYLON.MeshBuilder.CreatePlane(name, {}, scene);
    }
}
