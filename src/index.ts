import Grid from "./classes/Grid";
import AStar from "./classes/PathFinding/AStar";
import Grass from "./classes/Tile/Grass";
import Road from "./classes/Tile/Road";
import Stone from "./classes/Tile/Stone";

const grid = new Grid(20, 20)
  .fill(new Road())
  .set(3, 3, new Stone())
  .set(3, 2, new Stone())
  .set(2, 3, new Stone())
  .set(2, 4, new Stone())
  .set(12, 7, new Stone())
  .set(13, 7, new Stone())
  .set(14, 7, new Stone())
  .set(15, 7, new Stone())
  .set(1, 4, new Stone())
  .set(0, 4, new Stone())
  .set(4, 7, new Grass())
  .set(5, 7, new Grass())
  .set(6, 7, new Grass())
  .set(7, 7, new Grass())
  .set(8, 7, new Grass())
  .set(9, 7, new Grass())
  .set(10, 7, new Grass())
  .set(11, 7, new Grass());

const astar = new AStar(grid).setStart(18, 18).setEnd(0, 0);

const path = astar.solve();


// Very simple render function
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
const size = 800 / 20;

canvas.height = size * grid.height;
canvas.width = size * grid.width;

for (let x = 0; x < grid.width; x++) {
  for (let y = 0; y < grid.height; y++) {
    ctx.beginPath();
    ctx.rect(x * size, y * size, size, size);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#4444";
    ctx.stroke();

    ctx.fillStyle = grid.get(x, y).color;
    ctx.fill();
  }
}

if (path) {
  console.log("RUNNING");
  ctx.beginPath();
  ctx.moveTo(path[0].x * size + size / 2, path[0].y * size + size / 2);
  for (const loc of path) {
    ctx.lineTo(loc.x * size + size / 2, loc.y * size + size / 2);
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#EAB464";
  ctx.stroke();
}
