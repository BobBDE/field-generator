import {Component, OnInit} from '@angular/core';
import {Field} from './field';
import {Square} from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  field: Field;
  result: Square[][];
  total: number;

  ngOnInit(): void {

    this.generateField();
  }

  generateField() {
    this.field = new Field();

    this.result = this.field.field;
    this.total = this.field.total;
  }


}
