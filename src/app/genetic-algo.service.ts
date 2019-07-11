import {Injectable} from '@angular/core';
import {FieldGenerator} from './FieldGenerator';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneticAlgoService {


  public populationCount = 50;
  public generationNumber = 0;
  public generationLimit = 500;
  public currentBestScore = 100;
  public currentBestIndex = 100;
  public averageScore = 100;

  private generators: FieldGenerator[];

  public stop = false;

  public newGeneration$ = new Subject<FieldGenerator[]>();


  constructor() {
  }

  public firstGeneration() {
    this.generationNumber = 1;
    this.generators = [];
    for (let i = 0; i < this.populationCount; i++) {
      this.generators.push(new FieldGenerator());
    }

    this.calculateFitness();

    this.newGeneration$.next(this.generators);


    setTimeout(() => {
      if (!this.stop) {
        this.nextGeneration();
      }
    }, 3000);
  }


  public nextGeneration() {
    this.generationNumber++;
    console.log('Next génération ' + this.generationNumber);

    const newGeneration: FieldGenerator[] = [];
    for (let i = 0; i < this.populationCount; i++) {
      newGeneration.push(this.pickOne());
    }

    for (const oldField of this.generators) {
      oldField.dispose();
    }

    this.generators = newGeneration;

    // on calcule la fitness et tout
    this.calculateFitness();

    this.newGeneration$.next(this.generators);

    // setTimeout(() => {
    if (!this.stop && this.generationNumber < this.generationLimit) {
      this.nextGeneration();
    }
    // }, 1000);
  }

  // calcule de la fitness en fonction des autres generateurs
  private calculateFitness() {
    this.currentBestScore = 100;
    this.averageScore = 100;

    // on calcule la somme de tous les score des generateurs
    let totalScore = 0;

    let index = 0;
    // calcule du score  total de toute la génération et du meilleur score
    for (const field of this.generators) {
      totalScore += field.totalScore;

      if (field.totalScore < this.currentBestScore) {
        this.currentBestScore = field.totalScore;
        this.currentBestIndex = index;
      }

      index++;
    }

    // calcule le la moyenne
    this.averageScore = totalScore / this.populationCount;

    // calcule de la proba pour chaque génération d'être choisie
    for (const field of this.generators) {
      field.probaFitness = field.totalScore / totalScore;
    }
  }

  // choisi un field au hasard en fonction de la probfitness
  private pickOne() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r = r - this.generators[index].probaFitness;
      index++;
    }
    index--;
    const field = this.generators[index];
    return new FieldGenerator(field.brain, field.totalScore);
  }
}
