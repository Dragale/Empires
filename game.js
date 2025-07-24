const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let wood = 0;
let tileSize = 40;
let mapWidth = 15;
let mapHeight = 10;

let trees = [
  { x: 5, y: 5, collected: false },
  { x: 7, y: 4, collected: false }
];

let villager = { x: 2, y: 2 };
let soldiers = [];
let enemies = [
  { x: 10, y: 5, hp: 30 }
];

document.getElementById('createSoldier').addEventListener('click', () => {
  if (wood >= 20) {
    wood -= 20;
    soldiers.push({ x: villager.x, y: villager.y, hp: 30 });
    document.getElementById('wood').textContent = wood;
    updateCanvas();
  }
});

function drawMap() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      ctx.fillStyle = '#aad';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = '#666';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawTrees() {
  trees.forEach(tree => {
    if (!tree.collected) {
      ctx.fillStyle = 'green';
      ctx.fillRect(tree.x * tileSize + 10, tree.y * tileSize + 10, 20, 20);
    }
  });
}

function drawVillager() {
  ctx.fillStyle = 'brown';
  ctx.beginPath();
  ctx.arc(villager.x * tileSize + 20, villager.y * tileSize + 20, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawSoldiers() {
  soldiers.forEach(s => {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(s.x * tileSize + 20, s.y * tileSize + 20, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(e.x * tileSize + 20, e.y * tileSize + 20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(e.hp + "❤️", e.x * tileSize + 5, e.y * tileSize + 15);
  });
}

function collectWood() {
  trees.forEach(tree => {
    if (!tree.collected && tree.x === villager.x && tree.y === villager.y) {
      tree.collected = true;
      wood += 10;
      document.getElementById('wood').textContent = wood;
    }
  });
}

function handleCombat() {
  soldiers.forEach(s => {
    enemies.forEach(e => {
      const dx = s.x - e.x;
      const dy = s.y - e.y;
      if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        e.hp -= 1;
        s.hp -= 0.2;
      }
    });
  });
  enemies = enemies.filter(e => e.hp > 0);
  soldiers = soldiers.filter(s => s.hp > 0);
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawTrees();
  drawVillager();
  drawSoldiers();
  drawEnemies();
  handleCombat();
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && villager.y > 0) villager.y--;
  if (e.key === 'ArrowDown' && villager.y < mapHeight - 1) villager.y++;
  if (e.key === 'ArrowLeft' && villager.x > 0) villager.x--;
  if (e.key === 'ArrowRight' && villager.x < mapWidth - 1) villager.x++;
  collectWood();
  updateCanvas();
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tileSize);
  const y = Math.floor((e.clientY - rect.top) / tileSize);
  soldiers.forEach(s => {
    s.x = x;
    s.y = y;
  });
  updateCanvas();
});

updateCanvas();
