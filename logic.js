let board;
let score = 0;
let rows = 4;
let columns = 4;

// These variables will be used to monitor if the user already won in the value of 2048, 409, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // board = [
    // 	[32, 8, 4, 0],
    //     [4, 128, 64, 256],
    //     [8, 32, 16, 2],
    //     [16, 2, 256, 1024]
    // ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            // create div tile
            let tile = document.createElement("div");
            // each tile will each id based on position row and position column
            tile.id = r.toString() + "-" + c.toString();

            // get the number of a tile from backend board
            let num = board[r][c];

            // use and submit the number to update the tile's appearance through updateTile() function
            updateTile(tile, num);

            // add the created tile with id to the frontend game board container
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

// function to update the appearance of the tile based on its number
function updateTile(tile, num) {


    tile.innerText = "";
    tile.classList.value = "";

    tile.classList.add("tile");

    if (num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();

        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

// calling the setGame() function upon loading the window
window.onload = function () {
    setGame();
}

function handleSlide(e) {
    console.log(e.code);    //prints out the key being pressed

    // checking arrow key pressed
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {

        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        }
        else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        }
        else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        }
        else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerHTML = score;
    checkWin();

    if (hasLost() == true) {
        setTimeout(() => {
            alert("Game Over!");
            restartGame();
            alert("Click any arrow key to restart");
        }, 1000)
        // setTimeout is used to delay execution of the code inside the arrow function

    }
}

document.addEventListener("keydown", handleSlide);

// this function removes the zeroes from the row / column to help merge
function filterZero(row) {
    return row.filter(num => num != 0);
}

// merging the adjacent tiles 
function slide(row) {
    // example

    // [ 0, 2, 0, 2]
    row = filterZero(row);  // [2, 2]: removing zeroes

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {   // checks if a tile is equal to its adjacent tile
            row[i] *= 2;    // merge if the specific tile is the same as the next tile - doubles the first tile to merge
            // [4, 2]
            row[i + 1] = 0; // katabing tile is [4, 0]    

            score += row[i];
        }
    }

    row = filterZero(row);

    // Add zeroes on the back after mergin
    while (row.length < columns) {
        row.push(0);    // from [4, 0] to [4, 0, 0, 0] para buo parin ung tiles for empty tiles 
    }

    return row;         // submits the update row / column
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice();
        row = slide(row);   // slide function to merge the adjacent tiles.


        board[r] = row;

        // After merging, the position and the value of tiles might change, thus it follows that id, number, color of the tile must be changed.
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            if (originalRow[c] !== num && num !== 0) {

                tile.style.animation = "slide-from-right 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {

                tile.style.animation = "slide-from-left 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}


function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        // 1st tile,    2nd tile,     3rd tile     4th tile     of specific column
        let originalCol = col.slice();
        col = slide(col);


        // let changeIndices =[];
        // for (let r = 0; r < rows; r++) {
        //     if (originalCol[r] !== col[r]) {
        //         changeIndices.push(r);
        //     }

        // }


        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            let num = board[r][c];

            if (originalCol[r] !== num && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
            // if (changeIndices.includes(r) && num !== 0) {
            //     tile.style.animation = "slide-from-top 0.3s"
            //     setTimeout(() => {
            //         tile.style.animation = "";
            //     }, 300)
            // }
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        // 1st tile,    2nd tile,     3rd tile     4th tile     of specific column
        let originalCol = col.slice();
        col.reverse();
        col = slide(col);
        col.reverse();

        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            board[r][c] = col[r];
            let num = board[r][c];

            if (originalCol[r] !== num && num !== 0) {

                tile.style.animation = "slide-from-bottom 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // check if may empty tiles
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    // if walang nakitang zero type, type false
    return false;
}


// adds number '2' in the box per turn
function setTwo() {

    // will not do anything if the tile is not empty and will not generate any 2 if no empty tile left
    if (hasEmptyTile() == false) {
        return;
    }

    // code starts here for generating the random '2'
    let found = false;

    while (found == false) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            // Generate new tile
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }

}

// checks if you won certain scores congratulating us
function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048 && is2048Exist == false) {
                alert("You Win! You got the 2048");
                is2048Exist = true;
            } else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("You are Unstoppable at 4096");
                is4096Exist = true;
            } else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory! You have reached 8192! Congrats!");
                is8192Exist = true;
            }
        }

    }
}


// will check is there is still an empty tile (meaning if there is still a possible move) and will check also if there is a same adjacent tile.
function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            // will check if there is a tile that equal to zero, empty tile
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            // this code will check if there are two adjacent tiles.
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||

                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // if we found an adjacent tile with the same value as the current tilem falsem the user has not lost yet.
                return false;
            }
        }
    }

    // no empty tiles and no possible moves left, the user lost.
    return true;
}

function restartGame() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
        }

    }
    score = 0;
    setTwo();
}

// this code will listen when we touch the screen and assigns the x and y coordinates of the touch/event
// Inputs the x coordinate value to the startX and y coordinate value top startY
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!e.target.className.includes("tile")) {
        return
    }

    // to disable scolling feature
    e.preventDefault();
}, { passive: false }); // Use passive property to make sure that the preventDefault() will work.


document.addEventListener('touchend', (e) => {
    if (!e.target.className.includes("tile")) {
        return
    }

    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }

    document.getElementById("score").innerText = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any key to restart");
        }, 100);
    }

})

