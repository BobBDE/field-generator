import {Component, OnInit} from '@angular/core';
import {Config} from '../Config';
import {GeneratorMode} from '../model';

@Component({
  selector: 'app-config-generator',
  templateUrl: './config-generator.component.html',
  styleUrls: ['./config-generator.component.scss']
})
export class ConfigGeneratorComponent implements OnInit {


  populationCount: number = Config.populationCount;
  generationLimit: number = Config.generationLimit;
  fieldGenerationNumber: number = Config.fieldGenerationNumber;
  generatorMode: GeneratorMode = Config.generatorMode;
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

  generatorModeChange() {
    Config.generatorMode = this.generatorMode;
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
