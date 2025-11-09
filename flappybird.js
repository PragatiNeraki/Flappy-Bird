//borad
let board;
// let boardHeight = 168;
// let boardWidth = 300;
let context;

//bird
let birdWidth = 34; //w/h ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX;
let birdY;

let bird;

let birdImg;

//pipes
let pipeArray = []; //as game preogress, we keep on generating pipes so store here
let pipeWidth = 64; //w/h ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX;
let pipeY = 0;

let topPipImg;
let bottomPipeImg;

//phisics
let velocityX = -3; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.25; //after jump bird should come down

let gameOver = false;

let score = 0;


window.onload = function(){
    board = document.getElementById("board")
    board.height = window.innerHeight //full screen height
    board.width = window.innerWidth
    context = board.getContext("2d") //used for drawing on the board

    // set bird's initial position *after knowing board size*
    // birdX = board.width / 15;
    birdX = 100;
    birdY = board.height / 2;

    bird = {
        x: birdX,
        y: birdY,
        width: birdWidth,
        height: birdHeight
    };

    //drawBird
    birdImg = new Image();
    birdImg.src = "flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //pipes
    pipeX = board.width + 50;
    topPipImg = new Image();
    topPipImg.src = "toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";

    requestAnimationFrame(update);
    this.setInterval(placePipes, 1200); //every 1.5 secs
    // this.document.addEventListener("keydown", moveBird); //always listens to the jump keyboard button

    
}
document.addEventListener("keydown", e => {
    if (["Space", "ArrowUp", "KeyX"].includes(e.code)) {
        e.preventDefault();  // prevent page scroll
        velocityY = -6;      // smooth and consistent jump
        if(gameOver){
            resetGame();
        }else {
            velocityY -6; //bird jump
        }
    }
});
document.addEventListener("mousedown", () => {
    if (gameOver) {
        resetGame();
    } else {
        velocityY = -6; // bird jump
    }
});


function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0,0,board.width, board.height); //to clear prev frames
    
    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //limit jump to top of canvas
    context.drawImage(birdImg,bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for(let i=0; i < pipeArray.length; i++){

        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;//each pass has two pipe, top and bottom so together score 1
            pipe.passed = true;
        }
        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x +pipeArray[0].width < 0){
        pipeArray.shift();//removing the gone left pipes to save array memory
    }

            // Remove off-screen pipes
    pipeArray = pipeArray.filter(pipe => pipe.x + pipe.width > 0);

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER",5,90);
    }
}

function placePipes() {
    if(gameOver){
        return;
    }
    //randomly creating top pipes with uneven sizes taking the height 
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);

    //opening space btn top and bottom pipe
    openingSpace = board.height/4;

    let topPipe = {
        img : topPipImg,
        x : pipeX, 
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed: false // checks if the flappy bird has passed or no
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY -= 6;
    }
} 

function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function resetGame() {
    // Reset bird
    bird.x = 100;
    bird.y = board.height / 2;
    velocityY = 0;

    // Reset pipes
    pipeArray = [];
    pipeX = board.width + 50;

    // Reset score
    score = 0;

    // Reset game over flag
    gameOver = false;
}
