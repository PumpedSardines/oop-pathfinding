import { Position } from "../types/Position";

/**
 * Creates a loop with indexes between
 */
class GridLoop {
  private startX = 0;
  private startY = 0;

  private endX = 0;
  private endY = 0;

  private skips: Record<string, boolean> = {};

  /**
   * Generator for looping trough
   */
  *[Symbol.iterator](): Generator<[number, number]> {

    for (let x = this.startX; x < this.endX + 1; x++) {
      for (let y = this.startY; y < this.endY + 1; y++) {

        if(!this.skips[`${x}:${y}`]) {
          yield [x, y];
        }

      }
    }

    return;

  }

  /**
   * Set start position
   */
  setStart(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    return this;
  }

  /**
   * Set end position
   */
  setEnd(x: number, y: number) {
    this.endX = x;
    this.endY = y;
    return this;
  }

  /**
   * Skips a position during the loop trough
   */
  skip(x: number, y: number) {
    this.skips[`${x}:${y}`] = true;
    return this;
  }
}

export default GridLoop;