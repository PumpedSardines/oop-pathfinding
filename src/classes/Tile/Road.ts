import Tile from "./Tile";

class Road extends Tile {
  public get isBlocking() {
    return false;
  }

  public get modifier() {
    return 1;
  }

  public get color() {
    return "#F1EBE4";
  }
}

export default Road;
