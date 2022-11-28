// constants
const TILE_HEIGHT = 30;
const TILE_WIDTH = 30;
const MAP_HEIGHT = 23;
const MAP_WIDTH = 50;
const countDownStart = Date.now();
let gameOn = false;
const startMoney = 50;
let money = startMoney;
let score = 0;
let monsterWave = 1;
const startHP = 4;
let playerHP = startHP;
const towerTypes = 4;

// TURRET constants
let towerCount = 0;
let towerActual = [];

function towerColor(towerName){
    switch (towerName){
        case "1":
            return "#e1ff00";
        case "2":
            return "#ff9800";
        case "3":
            return "#ff0000";
        case "4":
            return "#00ffd0";
    }
}
function towerPrice(towerName){
    switch(towerName){
        case "1":
            return "10";
        case "2":
            return "100";
        case "3":
            return "200";
        case "4":
            return "500";
    }
}
function towerRange(towerName) {
    switch (towerName) {
        case "1":
            return 2;
        case "2":
            return 4;
        case "3":
            return 6;
        case "4":
            return 10;
    }
}
function towerDamage(towerName){
    switch(towerName){
        case "1":
            return 1;
        case "2":
            return 2;
        case "3":
            return 5;
        case "4":
            return 10;
    }
}
function towerName(pressedKey){
    switch (pressedKey){
        case "1":
            return "smallGun";
        case "2":
            return "bigGun";
        case "3":
            return "megaGun";
        case "4":
            return "miniGun";
    }

}

initGame();

function initGame() {
    // Your game can start here, but define separate functions, don't write everything in here :)
    function firstLevel(width, height) {
        if ((width === 2 && (height >= 0 && height <= 18)) ||
            (height === 18 && (width >= 2 && width <= 14)) ||
            (width === 14 && (height >= 3 && height <= 18)) ||
            (height === 3 && (width >= 14 && width <= 42)) ||
            (width === 42 && (height >= 3 && height <= 8 )) ||
            (height === 8 && (width >= 20 && width <= 42)) ||
            (width === 20 && (height >= 8 && height <= 14)) ||
            (height === 14 && (width >= 20 && width <= 42 )) ||
            (width === 42 && (height >= 14 && height <= 22))){
            return true;
        }
        return false;
    }

    function drawMap() {
        for (let width = 0; width < MAP_HEIGHT; width++) {
            for (let height = 0; height < MAP_WIDTH; height++) {
                let smallBlock = document.createElement('div');
                smallBlock.setAttribute('id', 'smallBlock' + height + "|" + width);
                smallBlock.setAttribute('class', 'smallBlock');
                smallBlock.style.left = TILE_HEIGHT * height + "px";
                smallBlock.style.top = TILE_WIDTH * width + "px";
                if (firstLevel(height, width)) {
                    smallBlock.classList.add("path");
                }
                if (width === 22 && height === 42) {
                    smallBlock.classList.add("end");
                }
                document.body.appendChild(smallBlock);
            }
        }
        for (let i = 1; i <= towerTypes; i++) {
            let iString = i.toString()
            let towerButton = document.createElement("div");
            towerButton.setAttribute("id", towerName(iString) + "_div");
            towerButton.setAttribute("class", "towerDiv");
            towerButton.style.borderColor=towerColor(iString);
            towerButton.style.top = 800 + "px";
            towerButton.style.left = 100 + 170*i + "px";
            towerButton.innerHTML = `<button id=${towerName(iString)} class="${i} towerButton" style="background-color: ${towerColor(iString)}" >` + "(" + i + ")" +
                towerName(iString) + "<br />" + towerPrice(iString) + "$</button>";
            document.body.appendChild(towerButton);
            towerButton.addEventListener("click", function(){
                placeTower(i.toString());
            });
        }
    }

    window.onload = function () {
        drawMap();
        createStartBtn();
        createStats();
        countScore();
        createResetBtn();
        createPopupButton();
        alert("Brave Hero! The ORSZÁG is in peril! The evil red sphere goblins are marching for MAKKOSHOTYKA ! ONLY YOU CAN SAVE US, HERO!");

    };
}

function createMonster(count = 1) {
    for (let i = 0; i < count; i++) {
        const monster = document.createElement("div");
        monster.classList.add("monster");
        monster.setAttribute("id", `monster-${i}`);
        document.body.appendChild(monster);
        monster.style.left = (2 * TILE_WIDTH) + "px";
    }
}


// ADD Start Game button and update it based on game progress

function createStartBtn () {
    const startBtn = document.createElement("button");
    const box = document.querySelector(".button");
    startBtn.innerText = "Start";
    startBtn.classList.add("start-btn");
    startBtn.style.fontSize = "35px";
    box.appendChild(startBtn);
    box.style.top = (800) + "px";
    startBtn.addEventListener("click", function () {
        if (startBtn.classList.contains("start-btn")) {
            gameOn = true;
            startMonsters();
            startBtn.classList.add("pause-btn");
            startBtn.classList.remove("start-btn");
            startBtn.innerText = "Pause";
        } else if (startBtn.classList.contains("pause-btn")) {
            gameOn = false;
            startBtn.innerText = "Resume";
            startBtn.classList.remove("pause-btn");
        } else if (!startBtn.classList.contains("pause-btn")) {
            gameOn = true;
            startBtn.innerText = "Pause";
            startBtn.classList.add("pause-btn");
        }
    })
}

// Handle monster waves

function startMonsters () {
    createMonster(2 + monsterWave);

    document.addEventListener("keypress", function(evt){
                if (evt["key"] === "1"||"2"||"3"||"4"||"c"){
                    placeTower(evt["key"]);
                }
            })

    // Reset Button

    const resetBtn = document.querySelector(".reset");
        resetBtn.addEventListener("click", function() {
            gameOn = false;
            for (let path of pathTiles) {
                for (let p = 0; p < monsters.length; p++) {
                    path.classList.remove(`${p}`);
                }
            }
            for (let monster of monstersLeft) {
                monster.remove();
            }
            let towers = document.querySelectorAll(".tower");
            for (let tower of towers) {
                tower.remove();
            }
            towerActual = [];
            towerCount = 0;
            let startBtn = document.querySelector(".button").children[0];
            startBtn.classList.add("start-btn");
            startBtn.classList.remove("pause-btn");
            startBtn.innerText = "Start";
            ypos = [];
            xpos = [];
            monsterRelease = [];
            direction = [];
            monsterHP = [];
            monsterCount = 1;
            playerHP = startHP;
            score = 0;
            monsterWave = 1;
            money = startMoney;
        })

    // Define monster stats

    let monsters = document.querySelectorAll(".monster");
    let monstersLeft = document.querySelectorAll(".monster");
    let ypos = [];
    let xpos = [];
    let monsterRelease = [];
    let monsterCount = 1;
    let monsterNumber = monsters.length;
    let direction = [];
    let monsterHP = [];
    let monsterValue = 100 * monsterWave;
    let pathTiles = document.querySelectorAll(".path");

    for (let j = 0; j < monsterNumber; j++) {
        ypos[j] = Number(window.getComputedStyle(document.getElementsByClassName("monster")[j]).top.slice(0, -2));
        xpos[j] = Number(window.getComputedStyle(document.getElementsByClassName("monster")[j]).left.slice(0, -2));
        monsterRelease[j] = 0;
        direction[j] = 1;
        monsterHP[j] = 10 * monsterWave;
    }

    // Monster movement and damage

    let moveMonsters = setInterval(function () {
        if (gameOn) {
            let EAST = 2;
            let WEST = -2;
            let NORTH = -1;
            let SOUTH = 1;
            let speed = 0;
            let currentRow = 0;
            let currentCol = 0;
            if (gameOn === true) speed = 5;
            if (gameOn === false) speed = 0;

            for (let m = 0; m < monsterCount; m++) {

                if (direction[m] === SOUTH || direction[m] === EAST) {
                    currentRow = Math.floor((ypos[m]) / TILE_HEIGHT);
                    currentCol = Math.floor((xpos[m]) / TILE_WIDTH);
                } else if (direction[m] === NORTH || direction[m] === WEST) {
                    currentRow = Math.floor((ypos[m] + (TILE_HEIGHT - 1)) / TILE_HEIGHT);
                    currentCol = Math.floor((xpos[m] + (TILE_WIDTH - 1)) / TILE_WIDTH);
                }

                let currentTile = document.getElementById(`smallBlock${currentCol}|${currentRow}`);
                currentTile.classList.add(`${m}`);

                if (currentCol > 0 &&
                    document.getElementById(`smallBlock${currentCol - 1}|${currentRow}`).classList.contains("path") &&
                    direction[m] !== EAST &&
                    !document.getElementById(`smallBlock${currentCol - 1}|${currentRow}`).classList.contains(`${m}`)) {
                    direction[m] = WEST;
                    xpos[m] += -speed;
                    monsters[m].style.left = xpos[m] + "px";

                } else if (currentCol < MAP_WIDTH - 1 &&
                    document.getElementById(`smallBlock${currentCol + 1}|${currentRow}`).classList.contains("path") &&
                    direction[m] !== WEST &&
                    !document.getElementById(`smallBlock${currentCol + 1}|${currentRow}`).classList.contains(`${m}`)) {
                    direction[m] = EAST;
                    xpos[m] += speed;
                    monsters[m].style.left = xpos[m] + "px";

                } else if (currentRow > 0 &&
                    document.getElementById(`smallBlock${currentCol}|${currentRow - 1}`).classList.contains("path") &&
                    direction[m] !== SOUTH &&
                    !document.getElementById(`smallBlock${currentCol}|${currentRow - 1}`).classList.contains(`${m}`)) {
                    direction[m] = NORTH;
                    ypos[m] += -speed;
                    monsters[m].style.top = ypos[m] + "px";

                } else if (currentRow < MAP_HEIGHT - 1 &&
                    document.getElementById(`smallBlock${currentCol}|${currentRow + 1}`).classList.contains("path") &&
                    direction[m] !== NORTH &&
                    !document.getElementById(`smallBlock${currentCol}|${currentRow + 1}`).classList.contains(`${m}`)) {
                    direction[m] = SOUTH;
                    ypos[m] += speed;
                    monsters[m].style.top = ypos[m] + "px";
                }

                if ((monsterRelease[m] === 50 * monsterCount) && monsterCount < monsterNumber) {
                    monsterCount++;
                }
                monsterRelease[m]++;

                // Calculate damage

                let damage = towerInRange(monsters[m], xpos[m], ypos[m]);
                monsterHP[m] -= damage;


                // Damage visualization on minions

                let percent = monsterHP[m] * 100/(monsterWave * 10);
                if(Math.round(percent) >= 0 && Math.round(percent) <= 100) {
                    let rgbUpdate = Math.round((255/100)*percent);
                    monsters[m].style.backgroundColor = `rgb(${rgbUpdate}, 0, 0)`;
                }


                if (monsterHP[m] <= 0) {

                    if (document.body.querySelector(`#monster-${m}`)) {
                        document.body.querySelector(`#monster-${m}`).remove();
                        money += monsterValue;
                        score += monsterValue;
                    };
                }

                // Update statistics on monster death

                let moneyValue = document.querySelector(".money").children[1];
                let scoreValue = document.querySelector(".score").children[1];
                let waveNumber = document.querySelector(".wave").children[1];
                moneyValue.innerText = money;
                scoreValue.innerText = score;
                waveNumber.innerText = monsterWave;



                // Monster reaches endpoint

                if (currentTile.classList.contains("end") && document.body.querySelector(`#monster-${m}`)) {
                    document.body.querySelector(`#monster-${m}`).remove();
                    playerHP -= 1;
                }
                let playerHPValue = document.querySelector(".player-hp").children[1];
                playerHPValue.innerText = playerHP;

                // Player dies
               if (playerHP === 0) {
                    gameOn = false;
                    monstersLeft = document.querySelectorAll(".monster");
                    for (let monster of monstersLeft) {
                        monster.remove();
                    }
                    let startBtn = document.querySelector(".pause-btn");
                    startBtn.classList.add("start-btn");
                    startBtn.classList.remove("pause-btn");
                    startBtn.innerText = "Start";
                    for (let path of pathTiles) {
                        for (let p = 0; p < monsters.length; p++) {
                            path.classList.remove(`${p}`);
                        }
                    }
                    let towers = document.querySelectorAll(".tower");
                    for (let tower of towers) {
                        tower.remove();
                    }
                    towerActual = [];
                    towerCount = 0;
                    ypos = [];
                    xpos = [];
                    monsterRelease = [];
                    direction = [];
                    monsterHP = [];
                    monsterCount = 1;
                    playerHP = startHP;
                    score = 0;
                    monsterWave = 1;
                    money = startMoney;
                    alert("GAME OVER");
                    return
                }

                monstersLeft = document.querySelectorAll(".monster");
                if (monstersLeft.length === 0) {
                    gameOn = false;
                    monsterWave++;
                    let startBtn = document.querySelector(".pause-btn");
                    startBtn.classList.add("start-btn");
                    startBtn.classList.remove("pause-btn");
                    startBtn.innerText = "Next Wave";
                    for (let path of pathTiles) {
                        for (let p = 0; p < monsters.length; p++) {
                            path.classList.remove(`${p}`);
                        }
                    }
                    ypos = [];
                    xpos = [];
                    monsterRelease = [];
                    direction = [];
                    monsterHP = [];
                    monsterCount = 1;
                    return
                }
            }
        }
        moneyCheckForTowers()
    }, 50);
}

// Displays the money,score and live stats
function createStats() {
    const moneyStat = document.createElement("div");
    const money = document.createElement("div");
    const moneyValue = document.createElement("div");
    moneyStat.appendChild(money);
    moneyStat.appendChild(moneyValue);
    money.innerText = "Money: ";
    moneyValue.innerText = "0";

    const scoreStat = document.createElement("div");
    const score = document.createElement("div");
    const scoreValue = document.createElement("div");
    score.innerText = "Score: ";
    scoreValue.innerText = "0";
    scoreStat.appendChild(score);
    scoreStat.appendChild(scoreValue)

    const playerStat = document.createElement("div");
    const playerHP = document.createElement("div");
    const playerHPValue = document.createElement("div");
    playerHP.innerText = "Health: ";
    playerHPValue.innerText = "0";
    playerStat.appendChild(playerHP);
    playerStat.appendChild(playerHPValue)

    const waveStat = document.createElement("div");
    const waveTitle = document.createElement("div");
    const waveNumber = document.createElement("div");
    waveTitle.innerText = "Wave: ";
    waveNumber.innerText = "1";
    waveStat.appendChild(waveTitle);
    waveStat.appendChild(waveNumber);

    const container = document.querySelector(".container");
    moneyStat.classList.add("money");
    scoreStat.classList.add("score");
    playerStat.classList.add("player-hp");
    waveStat.classList.add("wave");
    container.appendChild(moneyStat);
    container.appendChild(scoreStat);
    container.appendChild((playerStat));
    container.appendChild(waveStat);
    container.style.top = (800) + "px";
    container.style.left = (1050) + "px";
}
// Counts the score based on type
function countScore () {
    let addScore = setInterval(function () {
        if (gameOn) {
            score += 1;
            }
        }, 1000);}


// Calculates distance between monster and tower
function euclidDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// Checks if the monster is in range of the towers
function towerInRange (monster, x, y) {
    let damage = 0;
    for (let i = 0; i < towerCount; i++){
        let towerX = towerActual[i][2];
        let towerY = towerActual[i][3];
        if (euclidDistance(x, towerX, y, towerY) <= towerActual[i][0] * TILE_WIDTH) {
            // monster.style.backgroundColor = 'red';
            return towerActual[i][1];
        }
    }
    if (damage === 0){
        return damage;
    }
}
// Places down the selected tower type
let span = document.createElement("span")
span.setAttribute("id", "circle")
document.body.appendChild(span)

function circle(e, range) {
    document.getElementById('circle').style.display = "block";
    document.getElementById('circle').style.left = e.pageX + "px";
    document.getElementById('circle').style.top = e.pageY + "px";
}

function placeTower(towerID){
    let currentRange = towerRange(towerID);
    let need = currentRange * 30;
    let rangeCircle = document.getElementById('circle')
    rangeCircle.style.width = need + "px";
    rangeCircle.style.height = need + "px";
    window.addEventListener('mousemove', circle)
    let div = document.querySelectorAll('div')
    for (let i=0; i < div.length; i++) {
        div[i].classList.add('highLightBlock');
    }
    document.addEventListener("mousedown", function(event) {
        for (let l=0; l < div.length; l++){
            div[l].classList.remove('highLightBlock')
        }
        window.removeEventListener('mousemove', circle)
        document.getElementById('circle').style.display = 'None';
        let mousePositionX = event.pageX
        let mousePositionY = event.pageY
        let currentTile = document.getElementById(`smallBlock${Math.floor(mousePositionX / TILE_WIDTH)}|${Math.floor(mousePositionY / TILE_HEIGHT)}`);
        // Not a road check
        if (currentTile.classList.length < 2) {
            // Is there a tower there already check
            if (currentTile.children.length === 0) {
                if (gameOn) {
                    if (money >= towerPrice((towerID))) {
                        let turretPlacing = document.createElement("div");
                        turretPlacing.setAttribute("id", towerName(towerID) + "|" + towerCount++);
                        turretPlacing.setAttribute("class", "tower");
                        turretPlacing.style.backgroundColor = towerColor(towerID);
                        currentTile.appendChild(turretPlacing);
                        towerActual.push([towerRange(towerID), towerDamage(towerID), mousePositionX, mousePositionY]);
                        money -= towerPrice((towerID));
                        turretPlacing.setAttribute("data-range", `${towerRange(towerID)}`);
                        turretPlacing.setAttribute("data-damage", `${towerDamage(towerID)}`)
                    }
                }
            }
        }
    },{once:true})}

function moneyCheckForTowers(){
    let turretButtons = document.getElementsByClassName("towerDiv")
    for (let i = 0; i < turretButtons.length; i++){
        if (money >= towerPrice((i+1).toString())){
            turretButtons[i].style.backgroundColor = "green"
        }
        else{
            turretButtons[i].style.backgroundColor = "darkred"
        }
    }
}

function createResetBtn() {
    let box = document.querySelector(".button");
    let resetBtn = document.createElement("button");
    resetBtn.innerText = "Reset";
    resetBtn.classList.add("reset");
    resetBtn.style.fontSize = "35px";
    box.appendChild(resetBtn);
}

function createPopupButton() {
    let popUpButton = document.createElement("button");
    popUpButton.setAttribute("id", "popUpButton")
    popUpButton.setAttribute("class", "P2Wbutton")
    popUpButton.onclick = function () {makeMoneyPopup()}
    popUpButton.innerText= "WATCH AD TO RECEIVE BIG MONEY"
    popUpButton.style.left = 270 + "px"
    popUpButton.style.top = 960 + "px"
    document.body.appendChild(popUpButton)

}

function makeMoneyPopup() {
    let popupPictures = [
        "https://i.imgur.com/NJY46AT.png",
        "https://i.imgur.com/oMFRvFk.png",
        "https://i.imgur.com/WZOsZoa.png"
    ]
    gameOn = false
    let startBtn = document.querySelector(".pause-btn")
    startBtn.innerText = "Resume";
    startBtn.classList.remove("pause-btn");
    money += 5000
    for (let i = 0; i <= popupPictures.length; i++){
        window.open(`${popupPictures[i]}`, "blabla"+ i, `scrollbars=no,resizable=no,status=no,
        location=no,toolbar=no,menubar=no,
width=600,height=300,left=${400*i},top=${300*i}`)
    }
}

