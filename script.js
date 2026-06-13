const board = document.getElementById("board");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameOverText = document.getElementById("gameOver");
const novaIgraBtn = document.getElementById("novaIgra");

const size = 25;

let snake, direction, score, food, obstacles;
let level = 1;
let running = true;

const fruits = ["🍎", "🍐", "🍇", "🍊", "🍓", "🍉"];

function init() {
    snake = [{ x: 12, y: 12 }];
    direction = "right";
    score = 0;
    level = 1;
    running = true;
    obstacles = [];

    updateUI();
    spawnFood();
}

function updateUI() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    gameOverText.textContent = "";
    novaIgraBtn.style.display = "none";
}

function spawnFood() {
    const percent = 1 + (level * 0.2); // +20% po levelu

    food = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
        emoji: fruits[Math.floor(Math.random() * fruits.length)],
        value: percent
    };
}

function spawnObstacles() {
    obstacles = [];

    const count = level * 3; // više level = više prepreka

    for (let i = 0; i < count; i++) {
        obstacles.push({
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size)
        });
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

function move() {
    const head = { ...snake[0] };

    if (direction === "up") head.y--;
    if (direction === "down") head.y++;
    if (direction === "left") head.x--;
    if (direction === "right") head.x++;

    // zid
    if (head.x < 0 || head.y < 0 || head.x >= size || head.y >= size) {
        return gameOver();
    }

    // prepreke
    for (let o of obstacles) {
        if (head.x === o.x && head.y === o.y) {
            return gameOver();
        }
    }

    snake.unshift(head);

    // hrana
    if (head.x === food.x && head.y === food.y) {
        score += Math.floor(food.value);
        spawnFood();

        // LEVEL UP
        if (score > 0 && score % 5 === 0) {
            levelUp();
        }

    } else {
        snake.pop();
    }
}

function levelUp() {
    level++;

    // brža igra
    speed = Math.max(60, 120 - level * 10);

    // nove prepreke od levela 3
    if (level >= 3) {
        spawnObstacles();
    }

    updateUI();
}

function gameOver() {
    running = false;
    gameOverText.textContent = "💀 Game Over";
    novaIgraBtn.style.display = "inline-block";
}

function draw() {
    board.innerHTML = "";

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {

            const cell = document.createElement("div");
            cell.classList.add("cell");

            // food
            if (x === food.x && y === food.y) {
                cell.classList.add("food");
                cell.textContent = food.emoji;
            }

            // snake
            for (let s of snake) {
                if (s.x === x && s.y === y) {
                    cell.classList.add("snake");
                }
            }

            // obstacles
            for (let o of obstacles) {
                if (o.x === x && o.y === y) {
                    cell.classList.add("obstacle");
                }
            }

            board.appendChild(cell);
        }
    }
}

let lastTime = 0;
let acc = 0;
let speed = 120;

function loop(t) {
    if (!running) return;

    if (!lastTime) lastTime = t;
    const delta = t - lastTime;
    lastTime = t;

    acc += delta;

    if (acc > speed) {
        move();
        draw();
        acc = 0;
    }

    requestAnimationFrame(loop);
}

novaIgraBtn.addEventListener("click", () => {
    init();
    requestAnimationFrame(loop);
});

// start
init();
requestAnimationFrame(loop);
draw();