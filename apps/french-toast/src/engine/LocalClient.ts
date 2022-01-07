export class LocalClient {
  public user;
  public events = {};
  private lw;
  public host: boolean = false;
  public id: string;

  constructor(lw) {
    this.lw = lw;
    this.id = lw.id;
  }

  public on(evt, handler) {
    this.events[evt] = handler;
  }

  public emit(evt, data) {
    const keys = Object.keys(this.events);

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == evt) {
        this.events[evt].call(this, data);
        return;
      }
    }
    console.log("Error! Could not find event " + evt);
  }

  public clear(evt) {
    delete this.events[evt];
  }

  public send(evt, data) {
    this.lw.emit(evt, this.user, data);
  }
}
