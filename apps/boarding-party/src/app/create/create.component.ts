import { ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardingParty } from '../../engine/game';

@Component({
  selector: 'bp-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['/lobby'], {
        skipLocationChange: true
    });
    const players = 2;
    const game = new BoardingParty(players);
  }

}
