import { Position } from "../../types/Position";
import Grid from "../Grid";

abstract class PathFinding {
  protected grid: Grid;

  protected startX: number = 0;
  protected startY: number = 0;

  protected endX: number = 0;
  protected endY: number = 0;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  abstract solve(): Position[] | null;

  /**
   * Sets the start position
   * @param x The x position
   * @param y The y position
   * @returns This PathFinding
   */
  setStart(x: number, y: number) {
    this.startX = x;
    this.startY = y;

    return this;
  }

  /**
   * Sets the end position
   * @param x The x position
   * @param y The y position
   * @returns This PathFinding
   */
  setEnd(x: number, y: number) {
    this.endX = x;
    this.endY = y;

    return this;
  }
}

export default PathFinding;
