import {Component, Input, OnInit} from '@angular/core';
import {AbstractField} from '../field/AbstractField';

@Component({
  selector: 'app-display-field',
  templateUrl: './display-field.component.html',
  styleUrls: ['./display-field.component.scss']
})
export class DisplayFieldComponent implements OnInit {

  @Input() field: AbstractField;
  @Input() displayFieldScore = false;


  constructor() {
  }

  ngOnInit() {
  }

}
