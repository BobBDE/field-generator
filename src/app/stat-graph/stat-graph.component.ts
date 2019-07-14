import {Component, OnInit} from '@angular/core';
import {GeneticAlgoService} from '../genetic-algo.service';
import {Serie} from '../model';

/**
 * Graphique de stats des générations
 */
@Component({
  selector: 'app-stat-graph',
  templateUrl: './stat-graph.component.html',
  styleUrls: ['./stat-graph.component.scss']
})
export class StatGraphComponent implements OnInit {

  chartData: Serie[];

  private averageSerie: Serie;
  private bestSeries: Serie;

  constructor(private geneticAlgo: GeneticAlgoService) {
  }

  ngOnInit() {
    this.initChartData();

    this.geneticAlgo.generationStarted$.subscribe(
      () => this.initChartData()
    );

    this.geneticAlgo.newGeneration$.subscribe(
      () => this.getDataForGeneration()
    );
  }

  private initChartData() {
    this.chartData = [];

    // on ajoute la série pour la moyenne
    this.averageSerie = {
      name: 'Average',
      series: []
    };

    // on ajoute la série pour le meilleur
    this.bestSeries = {
      name: 'Best',
      series: []
    };
  }

  private getDataForGeneration() {

    this.averageSerie.series.push({
      name: this.geneticAlgo.currentGeneration.toString(),
      value: this.geneticAlgo.currentAverageScore
    });

    this.bestSeries.series.push({
      name: this.geneticAlgo.currentGeneration.toString(),
      value: this.geneticAlgo.currentBestScore
    });

    this.chartData = [this.averageSerie, this.bestSeries];

  }

}
