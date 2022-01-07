import { Component, OnInit } from '@angular/core';
import { FrenchToast } from '../../engine/FrenchToast';

@Component({
  selector: 'willhaycode-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new FrenchToast('wss://lipwig.willhaycode.com');
  }

}
