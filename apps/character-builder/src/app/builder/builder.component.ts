import { Component, OnInit, ViewChild } from '@angular/core';
import { Canvas } from '../../core/Canvas';

@Component({
  selector: 'willhaycode-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
    constructor() { }

    ngOnInit(): void {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('builder');
        new Canvas(canvas);
    }
}
