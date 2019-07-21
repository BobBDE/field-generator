import {Component, Input, OnInit} from '@angular/core';
import {FieldGenerator} from '../generator/FieldGenerator';

@Component({
  selector: 'app-display-generator',
  templateUrl: './display-generator.component.html',
  styleUrls: ['./display-generator.component.scss']
})
export class DisplayGeneratorComponent implements OnInit {

  @Input() generator: FieldGenerator;
  @Input() index: number;

  constructor() {
  }

  ngOnInit() {
  }

}
