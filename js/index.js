// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};
let gameStarted = true;

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }
        
    return false;
}

// Display the login popup
function showLoginPopup() {
    gameStarted = false;
    document.getElementById("loginPopup").style.display = "block";
    
}

function saveScore() {
    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;
    
    if (!userId || !password) {
        alert("Please enter both User ID and Password");
        return;
    }

    fetch('https://gaming-portal-be-seven.vercel.app/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            score: score,
            userId: userId,
            game: "snake",
            password: password   
        }),
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("loginPopup").style.display = "none";
        gameStarted = true; 
    })
    .catch(error => console.error("Error:", error));
}

function restartGame() {
    score = 0;
    inputDir = {x: 0, y: 0}; 
    snakeArr = [{x: 13, y: 15}];
    food = {x: 6, y: 7};
    gameStarted = true; // Allow the game to start moving

    // Reset score display
    document.getElementById("scoreBox").innerHTML = "Score: 0";
    
    // Hide the login popup and restart the game
    document.getElementById("loginPopup").style.display = "none";
    
    // Restart the game engine
    musicSound.play();
    window.requestAnimationFrame(main);
}

function gameEngine(){
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Your score: " + score);
        showLoginPopup();
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        // score = 0; 
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: Math.floor(Math.random() * 17 + 1), y: Math.floor(Math.random() * 17 + 1) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}


// Main logic starts here
musicSound.play();
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (!gameStarted) return;

    inputDir = { x: 0, y: 1 }; // Start the game
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
