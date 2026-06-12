const board = document.getElementById("board");
const scoreElement = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");
const novaIgraBtn = document.getElementById("novaIgra");

const size = 20;

let snake = [
    { x: 10, y: 10 }
];

let direction = "right";

let score = 0;

const fruits = ["🍎", "🍐", "🍇", "🍊", "🍓", "🍉"];

let food = {
    x: 5,
    y: 5,
    emoji: fruits[Math.floor(Math.random() * fruits.length)]
};

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }

    if (e.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }

    if (e.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    }

    if (e.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }

});

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

            snake.forEach(part => {
                if (part.x === x && part.y === y) {
                    cell.classList.add("snake");
                }
            });

            board.appendChild(cell);
        }
    }
}

function move() {

    const head = { ...snake[0] };

    if (direction === "up") head.y--;
    if (direction === "down") head.y++;
    if (direction === "left") head.x--;
    if (direction === "right") head.x++;

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= size ||
        head.y >= size
    ) {

        gameOverText.textContent = "💀 Game Over!";
        novaIgraBtn.style.display = "inline-block";

        clearInterval(gameLoop);

        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {

        score++;
        scoreElement.textContent = score;

        food = {
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size),
            emoji: fruits[Math.floor(Math.random() * fruits.length)]
        };

    } else {
        snake.pop();
    }

    draw();
}

draw();

const gameLoop = setInterval(move, 200);

novaIgraBtn.addEventListener("click", () => {
    location.reload();
});