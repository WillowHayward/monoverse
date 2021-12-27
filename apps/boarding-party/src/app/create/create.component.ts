import { ViewChild, Component, OnInit } from '@angular/core';
import { BoardingParty } from '../../engine/game';

@Component({
  selector: 'bp-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  start(): void {
    /*const players = this.count.value;
    const game = new BoardingParty(players);*/
  }

}
