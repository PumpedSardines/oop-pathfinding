import { Position } from "../../types/Position";
import Grid from "../Grid";
import GridLoop from "../GridLoop";
import PathFinding from "./PathFinding";

interface OpenSetItem {
  x: number;
  y: number;
  gCost: number;
  hCost: number;
  pointer: { x: number; y: number };
  explored: boolean;
}

/**
 * Open set to keep track of looped trough items when running A*
 */
class OpenSet {
  private map = new Map<string, OpenSetItem>();

  /**
   * Fetches an item from the open set
   * @param x The x position
   * @param y The y position
   * @throws If the item doesn't exist
   * @returns The item in the open set
   */
  get(x: number, y: number): OpenSetItem {
    const item = this.map.get(OpenSet.getId(x, y));

    if (!item) {
      throw new Error(
        `Couldn't find an item in the openset at location: (${x}, ${y})`
      );
    }

    return item;
  }

  /**
   * Places an item in the open set
   * @param x The x position
   * @param y The y position
   * @returns This open set
   */
  set(x: number, y: number, item: OpenSetItem): OpenSet {
    this.map.set(OpenSet.getId(x, y), item);
    return this;
  }

  /**
   * Gets all values in the open set
   */
  values() {
    return this.map.values();
  }

  /**
   * Sees if a certain element exists in the open set
   * @param x The x position
   * @param y The y position
   * @returns If that position is in the open set
   */
  has(x: number, y: number): boolean {
    return this.map.has(OpenSet.getId(x, y));
  }

  /**
   * Returns an id that can be used in the map for a certain position
   * @param x The x position
   * @param y The y position
   * @returns An id that represents that position
   */
  private static getId(x: number, y: number): string {
    return `${x}:${y}`;
  }
}

/**
 * A* implementation
 */
class AStar extends PathFinding {
  // Open set
  private openSet: OpenSet | null = null;

  /**
   * Find fastest path with a* path finding
   * @returns a list of position to follow
   */
  solve() {
    // Pull out relevant variables
    const { endX, endY, startY, startX, grid } = this;

    // start by making an open set
    this.openSet = new OpenSet();

    // add the start node to the open set
    this.openSet.set(startX, startY, {
      x: startX,
      y: startY,
      gCost: 0,
      hCost: this.heuristics(startX, startY),
      pointer: { x: startX, y: startY },
      explored: false,
    });

    while (true) {
      // Initiate while loop by finding a node to evaluate
      // Find the node with the lowest fCost

      const node = this.getNodeWithLowestFCost();

      // We couldn't find a node and therefore no path could be found
      // Return null to show that there is no path for the given nodes.
      if (node === null) {
        return null;
      }

      // Check if we've reached the end
      if (node.x === endX && node.y === endY) {
        // We have, trace back
        return this.pathTraceBack(node.x, node.y);
      }

      // Set the current node to explored
      node.explored = true;
      this.openSet.set(node.x, node.y, node); // Store it into the open set

      // Loop trough all neighbours
      this.openNeighbors(node.x, node.y);
    }
  }

  /**
   * Gets the node with lowest fCost
   * @returns The node with lowest fCost, null if no node could be found
   */
  private getNodeWithLowestFCost(): OpenSetItem | null {
    const { openSet } = this;

    // This should never happen since the this.solve() method sets this.openSet to a new OpenSet()
    // This will only be called if this function is ran outside of this.solve();
    if (openSet === null) {
      throw new Error("Can't find a node with a nonexistent openSet");
    }

    let node: OpenSetItem | null = null;

    // Loop trough all nodes in the open set
    for (const openSetNode of openSet.values()) {
      if (node === null) {
        // If null add the first non explored item
        if (!openSetNode.explored) {
          node = openSetNode;
        }
      } else {
        // Else compare fCost to the current node
        if (
          this.getFCost(node) > this.getFCost(openSetNode) &&
          !openSetNode.explored
        ) {
          node = openSetNode;
        }
      }
    }

    return node;
  }

  /**
   * Loops trough all nodes and their pointers and finds a path
   * @param x The x position of the node to get
   * @param y The y position of the node to get
   */
  private pathTraceBack(x: number, y: number): Position[] {
    const { openSet } = this;

    // This should never happen since the this.solve() method sets this.openSet to a new OpenSet()
    // This will only be called if this function is ran outside of this.solve();
    if (openSet === null) {
      throw new Error("Can't find a node with a nonexistent openSet");
    }

    // The return positions
    const returnValue: Position[] = [];

    /**
     * Recursive loop for finding the path
     * The reason for using recursion instead of a while loop
     * Is to protected against infinite while loops incase a bug was not accounted for
     * Since the path is at most 200 positions, performance is not an issue
     */
    const recursive = (x: number, y: number): Position[] => {
      const node = openSet.get(x, y);
      const { x: pointX, y: pointY } = node.pointer;

      if (pointX === x && pointY === y) {
        // If this node points to itself, we've reached the end
        return [node.pointer];
      } else {
        // Otherwise return this position with recursive for the next nodes
        return [
          ...recursive(pointX, pointY),
          {
            x: node.x,
            y: node.y,
          },
        ];
      }
    };

    return recursive(x, y);
  }

  private openNeighbors(x: number, y: number) {
    const { openSet, grid } = this;

    // This should never happen since the this.solve() method sets this.openSet to a new OpenSet()
    // This will only be called if this function is ran outside of this.solve();
    if (openSet === null) {
      throw new Error("Can't find a node with a nonexistent openSet");
    }

    const node = openSet.get(x, y);

    // Generate the loop
    const loop = new GridLoop()
      .skip(node.x, node.y)
      .setStart(node.x - 1, node.y - 1)
      .setEnd(node.x + 2, node.y + 2);

    // Loop trough all neighboring nodes
    for (const [x, y] of loop) {
      // Logic to skip this iteration
      if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) continue; // skip if x and y is outside ov board boundaries
      if (grid.get(x, y).isBlocking) continue; // If this position is unexplorable we skip it
      // If we're checking a diagonal, we need to know that the blocks next to it are not a block
      if (
        (Math.abs(node.y - y) == Math.abs(node.x - x) &&
          grid.get(node.x, y).isBlocking) ||
        grid.get(x, node.y).isBlocking
      )
        continue;

      const gCost =
        (Math.abs(node.y - y) == Math.abs(node.x - x) ? Math.sqrt(2) : 1) *
          grid.get(x, y).modifier +
        node.gCost;
      const hCost = this.heuristics(x, y);

      if (openSet.has(x, y) && gCost >= openSet.get(x, y).gCost) continue; // If we've already found this node and with a shorter path, keep that pointer

      openSet.set(x, y, {
        x,
        y,
        gCost,
        hCost,
        pointer: { x: node.x, y: node.y },
        explored: false,
      });
    }
  }

  /**
   * Calculates the value of a given position
   * @param x The x position
   * @param y The y position
   * @returns The value of this position
   */
  private heuristics(x: number, y: number): number {
    // Calculates amount of steps to the end node
    const xD = Math.abs(this.endX - x);
    const yD = Math.abs(this.endY - y);

    // How many diagonal steps needed to make
    const diagonalSteps = Math.max(xD, yD);
    // How many straight steps needed to make
    const straightSteps = Math.abs((xD > yD ? xD : yD) - diagonalSteps);

    // Multiply diagonalSteps with 1.414 because it's a bit longer
    return straightSteps + diagonalSteps * Math.sqrt(2);
  }

  /**
   * Quickly generate FCost
   * @param props An object that has the key hCost and gCost
   * @returns The fCost
   */
  private getFCost({ hCost, gCost }: { hCost: number; gCost: number }) {
    return hCost + gCost;
  }
}

export default AStar;
