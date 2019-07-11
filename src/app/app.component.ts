import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FieldGenerator} from './FieldGenerator';
import {GeneticAlgoService} from './genetic-algo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  generators: FieldGenerator[];

  constructor(public gaService: GeneticAlgoService) {
  }


  ngOnInit(): void {
    this.gaService.newGeneration$.subscribe(
      generators => {
        this.generators = generators;
      }
    );

    this.gaService.firstGeneration();
  }


  stopPlay() {
    this.gaService.stop = !this.gaService.stop;

    // si on reprend
    if (!this.gaService.stop) {
      this.gaService.nextGeneration();
    }
  }

  getBestField() {
  }

  ngAfterViewInit(): void {
  }


}
