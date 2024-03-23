const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    health: 100
};

let bullets = [];
let zombies = [];
let coins = 0;
let gameOver = false;
let win = false;
let keys = {};

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0';
        ctx.fill();
        ctx.closePath();
    });
}

function drawZombies() {
    zombies.forEach(zombie => {
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, zombie.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0';
        ctx.fill();
        ctx.closePath();
    });
}

function drawHealthBar() {
    ctx.fillStyle = '#f00';
    ctx.fillRect(10, 10, player.health * 2, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawZombies();
    drawHealthBar();
}

function update() {
    if (!gameOver && !win) {
        movePlayer();
        moveBullets();
        spawnZombies();
        moveZombies();
        checkCollisions();
        checkWinCondition();
        checkGameOver();
    }
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

canvas.addEventListener('click', function(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;
    shoot(mouseX, mouseY);
});

function shoot(mouseX, mouseY) {
    let angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    let velocityX = Math.cos(angle) * 5;
    let velocityY = Math.sin(angle) * 5;
    let bullet = {
        x: player.x,
        y: player.y,
        velocityX: velocityX,
        velocityY: velocityY
    };
    bullets.push(bullet);
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
    });
}

function movePlayer() {
    if (keys['w']) player.y -= player.speed;
    if (keys['a']) player.x -= player.speed;
    if (keys['s']) player.y += player.speed;
    if (keys['d']) player.x += player.speed;

    // Ensure the player stays within the canvas bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
}

function spawnZombies() {
    if (zombies.length < 5) {
        if (Math.random() < 0.02) {
            let zombie = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 10,
                health: 2, // Reduced zombie health to 2
                speed: 1
            };
            zombies.push(zombie);
        }
    }
}

function moveZombies() {
    zombies.forEach(zombie => {
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let angle = Math.atan2(dy, dx);
        zombie.x += Math.cos(angle) * zombie.speed;
        zombie.y += Math.sin(angle) * zombie.speed;
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        zombies.forEach((zombie, zombieIndex) => {
            let dx = bullet.x - zombie.x;
            let dy = bullet.y - zombie.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullet.radius + zombie.radius) {
                bullets.splice(bulletIndex, 1);
                zombie.health -= 1; // Decrease zombie health by 1 when hit by a bullet
                if (zombie.health <= 0) {
                    zombies.splice(zombieIndex, 1); // Remove zombie if its health is 0 or below
                    coins += 1;
                }
            }
        });
    });
}

function checkWinCondition() {
    if (coins >= 20) {
        win = true;
    }
}

function checkGameOver() {
    // Game over logic
}
