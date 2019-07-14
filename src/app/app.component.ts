import {Component, OnInit} from '@angular/core';
import {FieldGenerator} from './FieldGenerator';
import {GeneticAlgoService} from './genetic-algo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  generators: FieldGenerator[];

  generationStarted = false;
  generationEnded = false;

  constructor(public gaService: GeneticAlgoService) {
  }


  ngOnInit(): void {
    this.gaService.newGeneration$.subscribe(
      generators => {
        this.generators = generators;
      }
    );

    this.gaService.generationEnded$.subscribe(
      () => this.generationEnded = true
    );

  }

  startGeneration() {
    this.generationStarted = true;
    this.generationEnded = false;
    this.gaService.startGeneration();
  }


  stopPlay() {
    this.gaService.stop = !this.gaService.stop;

    // si on reprend
    if (!this.gaService.stop) {
      this.gaService.gotToNextGeneration();
    }
  }


}
