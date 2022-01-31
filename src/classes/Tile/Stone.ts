import Tile from "./Tile";

class Stone extends Tile {
  public get isBlocking() {
    return true;
  }

  public get modifier() {
    return 0;
  }

  public get color() {
    return "#242325";
  }
}

export default Stone;
