import Tile from "./Tile";

class Grass extends Tile {
  public get isBlocking() {
    return false;
  }

  public get modifier() {
    return 6;
  }

  public get color() {
    return "#519872";
  }
}

export default Grass;
