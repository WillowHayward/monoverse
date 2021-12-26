import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'whc-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {

    @Input() label?: string;
    @Input() id = '';

  constructor() { }

  ngOnInit(): void {
  }

}
