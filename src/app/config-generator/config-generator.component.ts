import {Component, OnInit} from '@angular/core';
import {Config} from '../Config';

@Component({
  selector: 'app-config-generator',
  templateUrl: './config-generator.component.html',
  styleUrls: ['./config-generator.component.scss']
})
export class ConfigGeneratorComponent implements OnInit {


  populationCount: number = Config.populationCount;
  generationLimit: number = Config.generationLimit;
  fieldGenerationNumber: number = Config.fieldGenerationNumber;
  fieldWidth: number = Config.fieldWidth;
  fieldHeight: number = Config.fieldHeight;
  blockCountPerField: number = Config.blockCountPerField;
  hiddenNodeCount: number = Config.hiddenNodeCount;
  timeBetweenGeneration: number = Config.timeBetweenGeneration;

  constructor() {
  }

  ngOnInit() {
  }

  populationCountChange() {
    Config.populationCount = this.populationCount;
  }

  generationLimitChange() {
    Config.generationLimit = this.generationLimit;
  }

  fieldGenerationNumberChange() {
    Config.fieldGenerationNumber = this.fieldGenerationNumber;
  }

  fieldWidthChange() {
    Config.fieldWidth = this.fieldWidth;
  }

  fieldHeightChange() {
    Config.fieldHeight = this.fieldHeight;
  }

  blockCountPerFieldChange() {
    Config.blockCountPerField = this.blockCountPerField;
  }

  hiddenNodeCountChange() {
    Config.hiddenNodeCount = this.hiddenNodeCount;
  }

  timeBetweenGenerationChange() {
    Config.timeBetweenGeneration = this.timeBetweenGeneration;
  }

}
