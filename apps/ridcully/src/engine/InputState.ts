import { Stage } from './Stage';
export class KeyState {
  public pressed = false;
  public value = 0; // Could be useful later for thumbsticks and such
  public justPressed = false;
  public justReleased = false;
  public key: string;
  constructor(key: string) {
    this.key = key;
  }

  public tick(delta: number) {
    this.justPressed = false;
    this.justReleased = false;
  }
}

export class MouseState {
  //TODO: Calculate mouse stuff here. 
  // https://stackoverflow.com/questions/6417036/track-mouse-speed-with-js
  // ^ for delta?
  public justMoved = false;
  public x = 0;
  public y = 0;
  public deltaX = 0;
  public deltaY = 0;

  public leftClicked = false;
  public leftJustClicked = false;
  public leftJustReleased = false;

  constructor(stage: Stage) {
    stage.onPointerMove = (evt: PointerEvent) => {
      this.justMoved = true;
      this.x = evt.x;
      this.y = evt.y;
      this.deltaX = evt.movementX;
      this.deltaY = evt.movementY;
    };

    stage.onPointerDown = (evt: PointerEvent) => {
      switch (evt.button) {
        case 0:
          this.leftClicked = true;
          this.leftJustClicked = true;
          break;
        default:
          return;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      // https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
      //0: Main button pressed, usually the left button or the un-initialized state
      //1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
      //2: Secondary button pressed, usually the right button
      //3: Fourth button, typically the Browser Back button
      //4: Fifth button, typically the Browser Forward button

    };

    stage.onPointerUp = (evt: PointerEvent) => {
      switch (evt.button) {
        case 0:
          this.leftClicked = false;
          this.leftJustReleased = true;
          break;
        default:
          return;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      // https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
      //0: Main button pressed, usually the left button or the un-initialized state
      //1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
      //2: Secondary button pressed, usually the right button
      //3: Fourth button, typically the Browser Back button
      //4: Fifth button, typically the Browser Forward button

    };
  }

  public tick(delta: number) {
    //TODO: Should delta x and y reset when justMoved did?
    //CONT: If they do, they would represent movement since last tick
    this.justMoved = false;
    this.leftJustClicked = false;
    this.leftJustReleased = false;
  }
}
