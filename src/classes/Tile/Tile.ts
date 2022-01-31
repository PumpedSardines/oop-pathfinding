abstract class Tile {
  /**
   * If this tile is passable
   */
  public abstract get isBlocking(): boolean;
  /**
   * Speed modifier if going over this tile
   */
  public abstract get modifier(): number;
  /**
   * The color of this tile
   */
  public abstract get color(): string;
}

export default Tile;
