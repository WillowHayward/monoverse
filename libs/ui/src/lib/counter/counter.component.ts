import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'whc-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
    @Input() value = 0;
    @Input() step = 1;
    @Input() min = 0;
    @Input() max = 10;

  constructor() { }

  ngOnInit(): void {
  }

  decrement(): void {
      const newValue = this.value - this.step;
      if (newValue >= this.min) {
        this.value = newValue;
      } else {
          this.value = this.min;
      }
  }

  increment(): void {
      const newValue = this.value + this.step;
      if (newValue <= this.max) {
        this.value = newValue;
      } else {
          this.value = this.max;
      }
  }

}
