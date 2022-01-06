import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Stage } from './Stage';
import { Asset, Texture, Mesh } from './Asset';

type AssetTypes = Texture | Mesh;
type AssetTypesSecond = typeof Texture | typeof Mesh;
type AssetPromiseTypes = Promise<Texture> | Promise<Mesh>;

enum AssetRootIds {
  TEXTURE,
  MESH,
  MATERIAL
}
export class Loader extends BABYLON.AssetsManager {
    public static skins = ['alienA','alienB','astroFemaleA','astroFemaleB','astroMaleA','astroMaleB','athleteFemaleBlue','athleteFemaleGreen','athleteFemaleRed','athleteFemaleYellow','athleteMaleBlue','athleteMaleGreen','athleteMaleRed','athleteMaleYellow','businessMaleA','businessMaleB','casualFemaleA','casualFemaleB','casualMaleA','casualMaleB','cyborg','fantasyFemaleA','fantasyFemaleB','fantasyMaleA','fantasyMaleB','farmerA','farmerB','militaryFemaleA','militaryFemaleB','militaryMaleA','militaryMaleB','racerBlueFemale','racerBlueMale','racerGreenFemale','racerGreenMale','racerOrangeFemale','racerOrangeMale','racerPurpleFemale','racerPurpleMale','racerRedFemale','racerRedMale','robot2','robot3','robot','survivorFemaleA','survivorFemaleB','survivorMaleA','survivorMaleB','zombieA','zombieB','zombieC']
    private emptyMesh: BABYLON.Nullable<BABYLON.Mesh> = null;
    private emptyMaterial: BABYLON.Nullable<BABYLON.Material> = null;
    private protoTexture: BABYLON.Nullable<BABYLON.Texture> = null;
    private scene: Stage;
    public state: number = 0; // 0 for empty, 1 for tasks waiting, 2 for loading
    private queue: string[];
    //private loaded: { [key:string] : Asset }

    public ready: boolean = true;

    constructor(stage: Stage) {
      super(stage);
      this.scene = stage;
      this.queue = [];
      //this.loaded = {};
      this.useDefaultLoadingScreen = false;
    }

    public get EmptyMesh(): BABYLON.Mesh {
      if (!this.emptyMesh) {
        this.emptyMesh = new BABYLON.Mesh('empty', this.scene);
        this.emptyMesh.material = this.EmptyMaterial;
      }
      return this.emptyMesh.clone().makeGeometryUnique();
    }

    public get EmptyMaterial(): BABYLON.StandardMaterial {
      if (!this.emptyMaterial) {
        const emptyMaterial = new BABYLON.StandardMaterial('empty', this.scene);
        const texture = this.ProtoTexture;
        emptyMaterial.diffuseTexture = texture;
        emptyMaterial.specularTexture = texture;
        emptyMaterial.emissiveTexture = texture;
        emptyMaterial.ambientTexture = texture;
        this.emptyMaterial = emptyMaterial;
      }
      return <BABYLON.StandardMaterial> this.emptyMaterial.clone('empty');
      
    }

    public get ProtoTexture(): BABYLON.Texture {
      if (!this.protoTexture) {
        this.protoTexture = new BABYLON.Texture('assets/texture/proto/purple.png', this.scene);
      }
      this.protoTexture.name
      return this.protoTexture.clone();
    }

    private isValidID(id: string): boolean {
      const idParts = id.split('.');
      if (idParts.length <= 1) {
        return false;
      }

      /*const rootID = idParts[0];
      if (!(rootID in this.loaded)) {
        return false;
      }*/

      return true;
    }

    /*private getExisting(id: string): Asset | false {
      if (!this.isValidID(id)) {
        return false;
      }
      
      const existing = this.loaded[id];
      if (existing) {
        switch(existing.getClassName()) {
          case "Mesh":
            return existing.clone('', null, 

        }
        console.log(typeof existing);
        return existing.clone();
      }

      /*const idParts = id.split('.');

      const rootID = idParts[0];
      let typeString = '';
      for (let i = 1; i < idParts.length - 1; i++) {
        typeString += idParts[i] + '/';
      }
      const asset = idParts[idParts.length - 1];*/

      /*return false;
    }*/

    public get(id: string): Promise<Asset> {
      const promiseFunction = ((resolve: (value: Asset) => void,
        reject: (reason: {
          message?: string,
          exception?: unknown
        }) => void) => {
          if (!this.isValidID(id)) {
            reject({message: id + ' is not a valid asset identifier'});
            return;
          }

          /*const existing = this.getExisting(id);
          console.log(existing);

          if (existing) {
            resolve(existing);
            return;
          }*/

          const idParts = id.split('.');
          const rootID = idParts[0];

          let typeString = '';
          for (let i = 1; i < idParts.length - 1; i++) {
            typeString += idParts[i] + '/'
          }

          const asset = idParts[idParts.length - 1];

          switch (rootID) {
            case 'texture':
              this.loadTexture(typeString, asset).then((value: Texture) => { // TODO: This will require expansion
                //this.loaded[id] = value;
                resolve(value);
              }).catch((reason: string) => {
                reject({message: reason});
              });
              break;
            case 'mesh':
              this.loadMesh(typeString, asset).then((value: Mesh) => { // TODO: This will require expansion
                //this.loaded[id] = value;
                resolve(value);
              }).catch((reason: string) => {
                reject({message: reason});
              });
              break;
            case 'material':
              //innerPromise = this.ge
            default:
              reject({message: rootID + ' is not a recognized asset type'});
              return;
          }


        }
      );

      let promise: Promise<Asset>;
      switch (id.split('.')[0]) {
        case 'texture':
        default:
          promise = new Promise<Asset>(promiseFunction);
          break;
      }
      this.state = 1;

      return promise;
        
    }

    //public getModel(
    private loadTexture(type: string, texture: string): Promise<Texture> {
      const promise = new Promise<Texture> (
        (resolve: (value: Texture) => void,
        reject: (reason: {
          message?: string,
          exception?: unknown
        }) => void) => {
          const task = this.addTextureTask(type + texture, 'assets/texture/' + type + texture + '.png', false, false);
          task.onSuccess = (task:BABYLON.TextureAssetTask) => {
            const text = task.texture;
            resolve(text);
          };

          task.onError = (task: BABYLON.TextureAssetTask) => {
            reject(task.errorObject);
          }
        }
      );
      this.state = 1;
          
      return promise;
    }

    public getTexture(type: string, texture: string): Promise<Texture> {
      let id = 'texture.' + type + '.' + texture;
      const promise = <Promise<Texture>> this.get(id);
      return promise;

      //TODO Change state to 1 if 0, add to task to queue if state is 2
      // TODO: Queue isn't gonna work, tasks are made from this. Custom format.
      // TODO: Callbacks? Promise?
      //TODO: For the delay queues, run this with a Promise within a Promise
    }

    private loadMesh(type: string, mesh: string): Promise<Mesh> {
      const promise = new Promise<Mesh>(
        (resolve: (value: Mesh) => void,
        reject: (reason: {
          message?: string,
          exception?: unknown
        }) => void) => {
          const task = this.addMeshTask(type + mesh, '', 'assets/mesh/' + type, mesh + '.glb');
          task.onSuccess = (task:BABYLON.MeshAssetTask) => {
            //const text = task.texture;
            const rootMesh = <Mesh> task.loadedMeshes[0];
            resolve(rootMesh);
          };

          task.onError = (task: BABYLON.MeshAssetTask) => {
            reject(task.errorObject);
          }
        }
      );
      this.state = 1;
          
      return promise;
    }

    public getMesh(type: string, mesh: string): Promise<Mesh> {
      let id = 'mesh.' + type + '.' + mesh;
      const promise = <Promise<Mesh>> this.get(id);
      return promise;
    }
    
    public start() {
      if (this.state == 1) {
        this.onFinish = (tasks: BABYLON.AbstractAssetTask[]) => {
          console.log('Completed ' + tasks.length + ' tasks');
          this.reset();
          if (this.queue.length > 0) {
            
          } else {
            this.state = 0;
          }
        }
        this.load();
      }
    }
}
