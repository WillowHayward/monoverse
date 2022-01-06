import * as BABYLON from 'babylonjs';
import * as CANNON from 'cannon';
import { Actor } from './Actor';
import { Loader } from './Loader';
import { Input } from './Input';


export class Stage extends BABYLON.Scene {
  public loader: Loader;
  public input: Input;
  public renderer: BABYLON.Nullable<BABYLON.DepthRenderer> = null;

  private actors: Actor[]; 

  private lastTick: number;

  constructor(engine: BABYLON.Engine) {
    super(engine);

    this.loader = new Loader(this);
    this.input = new Input(this);
    this.actors = [];
    this.lastTick = 0;

    window.CANNON = CANNON;
    this.enablePhysics();
  }

  public tick() {
    // Calculate delta
    if (this.lastTick == 0) {
      this.lastTick = Date.now();
    }

    const newTick = Date.now();
    let delta = newTick - this.lastTick;
    delta /= 1000;
    this.lastTick = newTick;

    // Actors act
    for (let i = 0; i < this.actors.length; i++) {
      const actor = this.actors[i];
      actor.tick(delta);
    }

    // Load queued assets
    if (this.loader.state == 1) {
      this.loader.start();
    }

    // Reset input
    this.input.tick(delta);

  }

  public add(actor: Actor) {
    this.actors.push(actor);
  }

  public start() {
    this.registerBeforeRender(() => {
      this.tick();
    });
  }

  public override enablePhysics(gravity?: BABYLON.Nullable<BABYLON.Vector3>, plugin?: BABYLON.IPhysicsEnginePlugin): boolean {
    const gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();

    return super.enablePhysics(gravityVector, physicsPlugin);
  }

  public override enableDepthRenderer(camera?: BABYLON.Nullable<BABYLON.Camera>, storeNonLinearDepth?: boolean, force32bitsFloat?: boolean): BABYLON.DepthRenderer {
    if (!this.renderer) {
      this.renderer = super.enableDepthRenderer(camera, storeNonLinearDepth, force32bitsFloat);
    }
    return this.renderer;
  }

}
