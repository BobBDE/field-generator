export class Helper {

  public static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
