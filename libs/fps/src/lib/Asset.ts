import * as BABYLON from 'babylonjs';

export interface Asset {
    getClassName(): string;
}
export class Texture extends BABYLON.Texture implements Asset {}
export class Mesh extends BABYLON.Mesh implements Asset {}
//export class Material extends BABYLON.Material implements Asset {};
