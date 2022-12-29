import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Stage, Camera } from '@whc/fps';
import { Player } from './Player';

export class Ships {
    private engine: BABYLON.Engine;
    private scene: Stage;

    constructor(canvasID: string) {
        const canvas = <HTMLCanvasElement>document.getElementById(canvasID);
        this.engine = new BABYLON.Engine(canvas);
        this.scene = new Stage(this.engine);
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);

        canvas.addEventListener('click', () => {
            //TODO: Check if pointerlocked at any moment, don't FPS if not

            canvas.requestPointerLock =
                canvas.requestPointerLock ||
                canvas.msRequestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        });

        this.createScene();
        this.startRender();
    }

    private async createScene() {
        new BABYLON.HemisphericLight(
            'light',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );

        //const player = new
        const camera = new Camera(this.scene);
        camera.position = new BABYLON.Vector3(5, 5, 5);

        // Create Skybox (TODO: Move this to... stage? A level class? Should the level class descend from stage?)
        const skybox = BABYLON.MeshBuilder.CreateBox(
            'skyBox',
            { size: 1000.0 },
            this.scene
        );
        const skyboxMaterial = new BABYLON.StandardMaterial(
            'skyBox',
            this.scene
        );
        const extensions = [
            '_right.png',
            '_top.png',
            '_front.png',
            '_left.png',
            '_bottom.png',
            '_back.png',
        ];
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
            'assets/texture/sky/sky',
            this.scene,
            extensions
        );
        skyboxMaterial.reflectionTexture.coordinatesMode =
            BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // Create ground (TODO: Move elsewhere, probably to stage subclass)
        const ground = BABYLON.Mesh.CreateGround(
            'ground',
            25,
            25,
            2,
            this.scene
        );
        const groundImposter = new BABYLON.PhysicsImpostor(
            ground,
            BABYLON.PhysicsImpostor.BoxImpostor,
            {
                mass: 0,
                restitution: 0.9,
            },
            this.scene
        );

        this.scene.start();
    }

    private startRender() {
        this.scene.renderer = this.scene.enableDepthRenderer();
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}
