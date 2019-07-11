import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../Field';

@Component({
  selector: 'app-display-field',
  templateUrl: './display-field.component.html',
  styleUrls: ['./display-field.component.scss']
})
export class DisplayFieldComponent implements OnInit {

  @Input() field: Field;
  @Input() displayFieldScore = false;


  constructor() {
  }

  ngOnInit() {
  }

}
