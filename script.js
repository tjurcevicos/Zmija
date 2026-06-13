const board = document.getElementById("board");
const scoreElement = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");
const novaIgraBtn = document.getElementById("novaIgra");

const size = 20;

let snake;
let direction;
let score;
let food;
let running = true;

const fruits = ["🍎", "🍐", "🍇", "🍊", "🍓", "🍉"];

function init() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    score = 0;
    running = true;

    scoreElement.textContent = score;
    gameOverText.textContent = "";
    novaIgraBtn.style.display = "none";

    spawnFood();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
        emoji: fruits[Math.floor(Math.random() * fruits.length)]
    };
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

    // collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= size ||
        head.y >= size
    ) {
        running = false;
        gameOverText.textContent = "💀 Game Over";
        novaIgraBtn.style.display = "inline-block";
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

/* 🔥 FIX: nema innerHTML flickera u draw */
function draw() {
    board.innerHTML = "";

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {

            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (x === food.x && y === food.y) {
                cell.classList.add("food");
                cell.textContent = food.emoji;
            }

            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === x && snake[i].y === y) {
                    cell.classList.add("snake");
                }
            }

            board.appendChild(cell);
        }
    }
}

let lastTime = 0;
let acc = 0;
const speed = 120;

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