import Grid from "./classes/Grid";
import AStar from "./classes/PathFinding/AStar";
import Grass from "./classes/Tile/Grass";
import Road from "./classes/Tile/Road";
import Stone from "./classes/Tile/Stone";
import { Position } from "./types/Position";

//
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

const astar = new AStar(grid).setStart(18, 18).setEnd(3, 2);

// Very simple render function
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
const size = 800 / 20;

canvas.height = size * grid.height;
canvas.width = size * grid.width;

const form: HTMLFormElement = document.getElementById("form") as any;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const startX = parseInt(data.get("start-x") as string);
  const startY = parseInt(data.get("start-y") as string);

  if (!isFinite(startX) || !isFinite(startY)) {
    return alert("Inte ett korrekt input");
  }

  if (startX < 0 || startX > 20) {
    return alert("Start x måste vara mindre än 20 och mer eller lika med 0");
  }
  if (startY < 0 || startY > 20) {
    return alert("Start y måste vara mindre än 20 och mer eller lika med 0");
  }

  const endX = parseInt(data.get("end-x") as string);
  const endY = parseInt(data.get("end-y") as string);

  if (!isFinite(endX) || !isFinite(endY)) {
    return alert("Inte ett korrekt input");
  }

  if (endX < 0 || endX > 20) {
    return alert("End x måste vara mindre än 20 och mer eller lika med 0");
  }
  if (endY < 0 || endY > 20) {
    return alert("End y måste vara mindre än 20 och mer eller lika med 0");
  }

  astar.setStart(startX, startY).setEnd(endX, endY);

  draw(astar.solve());
});

draw(astar.solve());

function draw(path: Position[] | null) {
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
    ctx.beginPath();
    ctx.moveTo(path[0].x * size + size / 2, path[0].y * size + size / 2);
    for (const loc of path) {
      ctx.lineTo(loc.x * size + size / 2, loc.y * size + size / 2);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#EAB464";
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.font = "64px Arial, Helvetica"
    ctx.fillStyle = "red";
    ctx.fillText("Ingen väg hittad", 200, 200);
  }
}

fetch("https://api.chucknorris.io/jokes/random")
  .then((v) => v.json())
  .then((v) => {
    const data = v.value;

    const joke = document.createElement("h1");
    joke.innerText = data;

    document.body.appendChild(joke);
  });
