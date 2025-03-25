document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const gameArea = document.getElementById('game-area');
    const dino = document.getElementById('dino');
    const scoreElement = document.getElementById('score');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const finalScoreElement = document.getElementById('final-score');

    let score = 0;
    let gameOver = false;
    let gameActive = false;
    let dinoBottom = 50;
    let isJumping = false;

    function startGame() {
        score = 0;
        gameOver = false;
        gameActive = true;
        scoreElement.textContent = score;
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        dino.style.bottom = '50px';
        clearAsteroids();
        generateAsteroids();
    }

    function endGame() {
        gameActive = false;
        gameOver = true;
        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    function jump() {
        if (!isJumping && gameActive) {
            isJumping = true;
            let jumpHeight = 0;
            const jumpInterval = setInterval(() => {
                if (jumpHeight < 150) {
                    jumpHeight += 10;
                    dino.style.bottom = `${50 + jumpHeight}px`;
                } else {
                    const fallInterval = setInterval(() => {
                        if (jumpHeight > 0) {
                            jumpHeight -= 10;
                            dino.style.bottom = `${50 + jumpHeight}px`;
                        } else {
                            clearInterval(fallInterval);
                            isJumping = false;
                        }
                    }, 20);
                    clearInterval(jumpInterval);
                }
            }, 20);
        }
    }

    function generateAsteroids() {
        if (!gameActive) return;

        const asteroid = document.createElement('div');
        asteroid.classList.add('asteroid');
        asteroid.style.top = `${Math.random() * (gameArea.clientHeight - 30)}px`;
        gameArea.appendChild(asteroid);

        let asteroidPosition = gameArea.clientWidth;
        const moveInterval = setInterval(() => {
            if (!gameActive) {
                clearInterval(moveInterval);
                return;
            }

            asteroidPosition -= 5;
            asteroid.style.right = `${-asteroidPosition}px`;

            // Check collision
            const dinoRect = dino.getBoundingClientRect();
            const asteroidRect = asteroid.getBoundingClientRect();

            if (
                dinoRect.left < asteroidRect.right &&
                dinoRect.right > asteroidRect.left &&
                dinoRect.top < asteroidRect.bottom &&
                dinoRect.bottom > asteroidRect.top
            ) {
                endGame();
                clearInterval(moveInterval);
            }

            // Remove asteroid and increase score
            if (asteroidPosition > gameArea.clientWidth + 30) {
                gameArea.removeChild(asteroid);
                clearInterval(moveInterval);
                score++;
                scoreElement.textContent = score;
            }

            // Generate next asteroid
            if (asteroidPosition < gameArea.clientWidth - 200) {
                clearInterval(moveInterval);
                generateAsteroids();
            }
        }, 20);
    }

    function clearAsteroids() {
        const asteroids = document.querySelectorAll('.asteroid');
        asteroids.forEach(asteroid => asteroid.remove());
    }

    // Controls
    document.addEventListener('keydown', (event) => {
        if ((event.code === 'Space' || event.code === 'ArrowUp') && gameActive) {
            jump();
        }
    });

    // Touch controls for mobile
    gameContainer.addEventListener('touchstart', (event) => {
        if (gameActive) {
            jump();
            event.preventDefault();
        }
    });

    // Mouse click controls
    gameContainer.addEventListener('click', () => {
        if (gameActive) {
            jump();
        }
    });

    // Start and restart buttons
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
});
