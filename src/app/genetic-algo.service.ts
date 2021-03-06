import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Config} from './Config';
import {GeneratorFactory} from './GeneratorFactory';
import {NeuralNetwork} from './NeuralNetwork';
import {AbstractGenerator} from './generator/AbstractGenerator';


@Injectable({
  providedIn: 'root'
})
export class GeneticAlgoService {

  public populationCount: number;
  public generationLimit: number;
  private timeBetweenGeneration: number;

  // génération actuel
  public currentGeneration = 0;
  public currentBestScore = -1;
  public currentBestIndex = -1;
  public currentAverageScore = -1;

  // toute generation confondu
  // meilleur score en tout
  public bestScore = -1;
  public bestGeneration = -1;

  // score maximal atteignable
  public maxScore;

  // permet d'avoir le temps d'execution
  private startTime: number;

  private generators: AbstractGenerator[];

  // permet de bloquer la génération
  public stop: boolean;

  // appeler lorsqu'une nouvelle génération est prête
  public newGeneration$ = new Subject<AbstractGenerator[]>();
  public generationStarted$ = new Subject<void>();
  public generationEnded$ = new Subject<void>();

  constructor() {
  }

  public startGeneration() {
    this.initValues();
    this.startTime = new Date().getTime();

    this.gotToNextGeneration();
  }

  private nextGeneration() {
    this.currentGeneration++;
    console.log('Next génération ' + this.currentGeneration);
    // console.log(tf.memory());

    const newGeneration: AbstractGenerator[] = [];

    // première génération
    if (this.currentGeneration === 1) {
      // génération de la première génération
      for (let i = 0; i < this.populationCount; i++) {
        newGeneration.push(this.createGenerator());
      }
    }
    // les générations suivantes
    else {
      for (let i = 0; i < this.populationCount; i++) {
        newGeneration.push(this.pickOne());
      }

      // on clean les anciens
      for (const oldField of this.generators) {
        oldField.dispose();
      }
    }

    // on set les générateurs
    this.generators = newGeneration;

    // on calcule la fitness et tout
    this.calculateFitness();

    // on prévient d'une nouvelle génération
    this.newGeneration$.next(this.generators);

    // passer a la génération suivante
    if (!this.stop && this.currentGeneration < this.generationLimit) {
      this.gotToNextGeneration();
    } else {
      // si la génération est finie
      if (!this.stop) {
        const duration = new Date().getTime() - this.startTime;
        console.log('Fin en ' + duration + 'ms');

        this.generationEnded$.next();
      }
    }
  }

  public gotToNextGeneration() {
    if (this.timeBetweenGeneration === 0) {
      this.nextGeneration();
    } else {
      setTimeout(() => {
          this.nextGeneration();
        },
        this.timeBetweenGeneration);
    }
  }


  // calcule de la fitness en fonction des autres generateurs
  private calculateFitness() {
    this.currentBestScore = -1;
    this.currentAverageScore = -1;

    // on calcule la somme de tous les score des generateurs
    let totalScore = 0;

    let index = 0;
    // calcule du score  total de toute la génération et du meilleur score
    for (const field of this.generators) {
      totalScore += field.totalScore;

      if (field.totalScore > this.currentBestScore) {
        this.currentBestScore = field.totalScore;
        this.currentBestIndex = index;
      }

      index++;
    }

    // calcule le la moyenne
    this.currentAverageScore = totalScore / this.populationCount;

    // calcule de la proba pour chaque génération d'être choisie
    for (const field of this.generators) {
      field.fitness = field.totalScore / totalScore;
    }

    // if (this.currentBestScore >= this.maxScore) {
    //   this.stop = true;
    //   this.generationEnded$.next();
    // }

    if (this.currentBestScore > this.bestScore) {
      this.bestScore = this.currentBestScore;
      this.bestGeneration = this.currentGeneration;
    }
  }

  // choisi un field au hasard en fonction de la probfitness
  private pickOne(): AbstractGenerator {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r = r - this.generators[index].fitness;
      index++;
    }
    index--;
    const field = this.generators[index];
    return this.createGenerator(field.brain);
  }

  private createGenerator(previousBrain?: NeuralNetwork): AbstractGenerator {
    return GeneratorFactory.createGenerator(Config.generatorMode, previousBrain);
  }

  private initValues() {
    // on prévient de la génération
    this.generationStarted$.next();

    // on récupère la config
    this.populationCount = Config.populationCount;
    this.generationLimit = Config.generationLimit;
    this.timeBetweenGeneration = Config.timeBetweenGeneration;
    this.maxScore = ((Config.fieldWidth + Config.fieldHeight) + 5) * Config.fieldGenerationNumber;

    // initialisation des variables
    this.currentGeneration = 0;
    this.currentBestScore = -1;
    this.currentBestIndex = -1;
    this.currentAverageScore = -1;
    this.generators = [];

    this.stop = false;
  }
}
