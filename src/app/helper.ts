export class Helper {

  public static roundRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
