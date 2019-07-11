import * as tf from '@tensorflow/tfjs';
import {Helper} from './helper';

export class NeuralNetwork {

  private model: any;
  private readonly inputNodes: number;
  private readonly hiddenNodes: number;
  private readonly outputNodes: number;

  constructor(inputNodes: number, hiddenNodes: number, outputNodes: number, model: tf.Sequential = null) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;
    if (model != null) {
      this.model = model;
    } else {
      this.model = this.createModel();
    }

  }

  copy(): NeuralNetwork {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes, modelCopy) as any;
    });
  }

  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        const tensor = weights[i];
        const shape = weights[i].shape;
        const values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (Helper.random(0, 1) < rate) {
            const w = values[j];
            values[j] = w + Helper.random(-0.1, 0.1);
          }
        }
        mutatedWeights[i] = tf.tensor(values, shape);
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  dispose() {
    this.model.dispose();
  }

  predict(inputs: number[]): number[] {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      // console.log(outputs);
      return ys.dataSync();
    });
  }

  createModel(): tf.Sequential {
    const model = tf.sequential();
    const hidden = tf.layers.dense({
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: 'sigmoid'
    });
    model.add(hidden);
    const output = tf.layers.dense({
      units: this.outputNodes,
      activation: 'linear'
    });
    model.add(output);
    return model;
  }
}
