import OutOfBoundsError from "./Errors/OutOfBoundsError";
import Tile from "./Tile/Tile";

/**
 * A grid of tiles
 */
class Grid {
  public width: number;
  public height: number;
  protected tiles: Tile[] = [];

  /**
   * @param width width of the grid
   * @param height height of the grid
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * Fills the entire grid with one tile
   * @param tile The tile to fill the grid with
   * @returns This Grid
   */
  fill(tile: Tile) {
    // This is how you init an array in TypeScript
    this.tiles = new Array(this.width * this.height)
      .fill(0)
      // The map here is needed to remove reference
      .map((v) => tile);

    return this;
  }

  /**
   * Sets a position to a certain tile
   * @param x x position
   * @param y y position
   * @param tile the tile to set
   * @returns This Grid
   */
  set(x: number, y: number, tile: Tile) {
    // First validate if x or y is outside of bounds
    // Call the helper function that will throw if it's outside of bounds
    this.throwOutsideOfBounds(x, y);

    this.tiles[x + y * this.width] = tile;
    return this;
  }

  /**
   * Gets a tile at a certain position
   * @param x x position
   * @param y y position
   * @returns the tile at that position
   */
  get(x: number, y: number): Tile {
    // First validate if x or y is outside of bounds
    // Call the helper function that will throw if it's outside of bounds
    this.throwOutsideOfBounds(x, y);

    return this.tiles[x + y * this.width];
  }

  /**
   * Helper to throw an outside of bounds error if
   * @param x x position
   * @param y y position
   */
  private throwOutsideOfBounds(x: number, y: number) {
    if (x < 0) {
      throw new OutOfBoundsError("x can't be less than 0");
    }

    if (x >= this.width) {
      throw new OutOfBoundsError("x can't be bigger than " + this.width);
    }

    if (y < 0) {
      throw new OutOfBoundsError("y can't be less than 0");
    }

    if (y >= this.height) {
      throw new OutOfBoundsError("y can't be bigger than " + this.height);
    }
  }
}

export default Grid;
