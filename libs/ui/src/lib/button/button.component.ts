import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'whc-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
    @Input() value = '';
  constructor() { }

  ngOnInit(): void {
  }

}
