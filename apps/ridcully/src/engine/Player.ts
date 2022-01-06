import * as BABYLON from 'babylonjs';
import { Loader } from './Loader';
import { Stage } from './Stage';
import { Camera } from './Camera';
import { Mesh } from './Asset';
import { Actor } from './Actor';

export class Player extends Actor {
  private meshName = 'medium';
  private speed = 5.0;
  private runSpeed = 7.0;
  public camera: BABYLON.Nullable<Camera> = null;

  private imposter: BABYLON.Nullable<BABYLON.PhysicsImpostor> = null;

  private sensitivity = 0.1;

  constructor(name: string, scene: Stage) {

    super(name, scene);

    this.setMesh('character', this.meshName).then((value: Mesh) => {
      console.log('Physics');
      this.imposter = new BABYLON.PhysicsImpostor(this.root, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 1,
        restitution: 0.9
      }, this.scene);
      if (name == 'player') {
        return;
      }
    });

    window.addEventListener('keydown', (evt: KeyboardEvent) => {
      if (evt.key == 'q') {
        //console.log(this.node.rotation.y, this.headNode.rotation.y);
      }
    });
    this.setSkin();
  }

  public createCamera(): BABYLON.Camera {
    //TODO: For split screen later https://doc.babylonjs.com/how_to/how_to_use_multi-views
    let camera = new Camera(this.scene);
    this.camera = camera;

    return camera;
  }

  public tick(delta: number) {
    super.tick(delta);
    if (this.camera) {
      this.camera.tick(delta, this);

      let calculatedSpeed = delta;
      if (this.scene.input.key['shift'].pressed) {
        calculatedSpeed *= this.runSpeed;
      } else {
        calculatedSpeed *= this.speed;
      }

      //TODO: Move to class property
      //CONT: Or ideally a controller manager for customisability
      //CONT: Then move the surrounding if block to if (this.controllerManger)
      const forwardKey = this.scene.input.key['w'];
      const backwardKey = this.scene.input.key['s'];
      const leftKey = this.scene.input.key['a'];
      const rightKey = this.scene.input.key['d'];

      const fAxis = forwardKey.value - backwardKey.value;
      const sAxis = rightKey.value - leftKey.value;

      const fSpeed = fAxis * calculatedSpeed;
      const sSpeed = sAxis * calculatedSpeed;

      if (this.scene.input.mouse.justMoved) {
        const deltaX = this.scene.input.mouse.deltaX;
        const deltaY = this.scene.input.mouse.deltaY;

        // Note: X and Y have to swap from mouse to axis
        this.headNode.rotation.x += deltaY * delta * this.sensitivity; //TODO: Cap these values
        const yRotate = deltaX * delta * this.sensitivity; // Change root node 
        //this.root.rotate(BABYLON.Vector3.Up(), yRotate);
        //this.root.rotation.y += yRotate;
        const rotQuat = this.root.rotationQuaternion;
        if (rotQuat) {
          const rotEuler = rotQuat.toEulerAngles();
          rotEuler.y += yRotate;
          this.headNode.rotation.y += yRotate;
          this.root.rotationQuaternion = rotEuler.toQuaternion();

          //this.root.rotationQuaternion.x += yRotate;
        }
        //this.skin.rotation.y += yRotate;
      }

      let rotation = this.root.rotationQuaternion?.toEulerAngles()?.y;
      //rotate = this.root.addRotation
      if (rotation) {
        let zMove = fSpeed * Math.cos(rotation);
        let xMove = fSpeed * Math.sin(rotation);
        const moveVector = new BABYLON.Vector3(xMove, 0, zMove);

        rotation += Math.PI / 2; // Turn to right
        
        zMove = sSpeed * Math.cos(rotation);
        xMove = sSpeed * Math.sin(rotation);
        moveVector.z += zMove;
        moveVector.x += xMove;

        const position = this.root.position;
        position.subtractInPlace(moveVector); // Subtract because quaternions
        this.headNode.position = position.clone();
        const skel = this.skin.skeleton;
        if (skel) {
          const headBoneIndex = skel.getBoneIndexByName('Head');
          if (headBoneIndex >= 0) {
            console.log('HEADNODE');
            const headBone = skel.bones[headBoneIndex];
            const headPos = headBone.getAbsolutePosition();
            this.headNode.position.y += headPos.y;
          }
        }

      }

    } else {
      /*const skel = this.skin.skeleton;
      if (skel) {
        const headIndex = skel.getBoneIndexByName('Head');
        if (headIndex >= 0) {
          const headBone = skel.bones[headIndex];
          const headNode = headBone.getTransformNode();
          if (headNode) {
            headNode.rotation.y += 1 * delta;
            console.log('Head turn');
          }
        }
      }*/
      //this.node.rotation.y += delta * 1;

    }
  }

  public setSkin(skin?: string) {
      if (!skin) {
        const skins = Loader.skins;
        const index = Math.floor(Math.random() * skins.length);
        skin = skins[index];
      }
      this.setTexture('skin', skin);
  }

  public set accessory(accessory: BABYLON.Mesh) {
    if (this.skin.skeleton) {
      const headIndex = this.skin.skeleton.getBoneIndexByName('Head');
      if (headIndex >= 0) {

        console.log(this.root.getChildMeshes());
        const head = this.skin.skeleton.bones[headIndex];
        const headTFNode = head.getTransformNode();
        if (!headTFNode) {
          return;
        }
        console.log(headTFNode);
        headTFNode.position.y = -headTFNode.position.y ;
        accessory.attachToBone(head, headTFNode);
      }
    }
  }

  public get skeleton(): BABYLON.Nullable<BABYLON.Skeleton> {
    return this.skin.skeleton;
  }

}
