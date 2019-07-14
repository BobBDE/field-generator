

// liste des configs
export class Config {

  //////////////// GENERATION //////////////////
  // nombre de générateur par génération
  public static populationCount = 50;

  // limit du nombre de génération
  public static generationLimit = 100;

  // temps de temporisation entre les generation
  public static timeBetweenGeneration = 0;

  ////////////// FIELD GENERATOR /////////////////
  // nombre de terrain qui sont généré par FieldGenerator par génération
  public static fieldGenerationNumber = 25;
  // largeur du terrain a générer
  public static fieldWidth = 5;
  // hateur du terrain a générer
  public static fieldHeight = 5;
  // nombre de block a mettre sur le terrain
  public static blockCountPerField = 4;

  // nombre de hiddenNode du réseaux de neuron
  public static hiddenNodeCount = 50;
}
