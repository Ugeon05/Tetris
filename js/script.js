import BLOCKS from "./blocks.js";

const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");
const nextBlocksContainer = document.querySelectorAll(".next-block");
const speedUpText = document.querySelector(".up");
const volumeSlider = document.getElementById('volumeSlider');
const mainVolumeSlider = document.getElementById('mainVolumeSlider');
const audioPlayer = document.getElementById('audioPlayer');
const optionMenu = document.querySelector(".option-menu");
const exitButton = document.querySelector(".exit");
const pauseContainer = document.querySelector(".pause-container");
const keepContainer = document.querySelector(".keep-block");
const soundButton = document.querySelector(".sound-button");
const reButton = document.querySelector(".re-button");
const mainButton = document.querySelector(".main-button");
const soundContainer = document.querySelector(".pause-volume");
const soundExit = document.querySelector(".sound-exit");
const htpContainer = document.querySelector(".HTP-container");
const htpButton = document.querySelector(".HTP-button");
const htpExitButton = document.querySelector(".htp-exit");
const bindingEn = document.querySelector(".binding-en");
const bindingKr = document.querySelector(".binding-kr");
const bindingEnButton = document.querySelector(".en");
const bindingKrButton = document.querySelector(".kr");

const GAME_ROWS = 20;
const GAME_COLS = 10;
const PREVIEW_COLS = 4;
const PREVIEW_ROWS = 2;

let score = 0;
let duration = 1250;
let downInterval;
let tempMovingItem;
let nextBlocks = [];
let isPaused = false; // 일시 정지 상태를 추적하는 변수
let holdItem = null; // 홀드 블록을 추적하는 변수
let initCount = 0;
let gameOver = 0;
let saveMusic = "";


const movingItem = {
    type: "",
    direction: 3,
    top: 0,
    left: 0,
};


let effectVolume = document.getElementById('effectVolumeSlider').value / 100;

// 사운드 볼륨을 설정하는 함수
function setEffectVolume(volume) {
    effectVolume = volume / 100;
}

// 슬라이더 동기화 함수
function syncSliders(volume) {
    document.getElementById('effectVolumeSlider').value = volume;
    document.getElementById('pauseEffectSlider').value = volume;
}

// 슬라이더 변경 이벤트 리스너 추가
document.getElementById('effectVolumeSlider').addEventListener('input', function() {
    let volume = this.value;
    setEffectVolume(volume);
    syncSliders(volume);
});

document.getElementById('pauseEffectSlider').addEventListener('input', function() {
    let volume = this.value;
    setEffectVolume(volume);
    syncSliders(volume);
});

// 사운드 재생 함수
function moveSound() {
    let sound = new Audio("effect/move.mp3");
    sound.volume = effectVolume;
    sound.play();
}

function dropSound() {
    let sound = new Audio("effect/drop.mp3");
    sound.volume = effectVolume;
    sound.play();
}

function notHoldSound() {
    let sound = new Audio("effect/nothold.mp3");
    sound.volume = effectVolume;
    sound.play();
}

function matchedSound() {
    let sound = new Audio("effect/matched.mp3");
    sound.volume = effectVolume;
    sound.play();
}

function gameOverSound() {
    let sound = new Audio("effect/gameover.mp3");
    sound.volume = effectVolume;
    sound.play();
}

function holdSound() {
    let sound = new Audio("effect/hold.mp3");
    sound.volume = effectVolume;
    sound.play();
}

function rotateSound() {
    let sound = new Audio("effect/rotate.mp3");
    sound.volume = effectVolume;
    sound.play();
}



// 음악 재생 함수
function playMusic(musicPath) {
    audioPlayer.pause();
    audioPlayer.src = musicPath;
    audioPlayer.play();
    addVolumeControlListener();
    audioPlayer.loop = true;
}

// 볼륨 조절 이벤트 리스너
function addVolumeControlListener() {
    volumeSlider.addEventListener('input', function () {
        const volume = this.value / 100;
        audioPlayer.volume = volume;
        mainVolumeSlider.value = this.value; // mainVolumeSlider 값을 동일하게 설정
    });
    
    mainVolumeSlider.addEventListener('input', function () {
        const volume = this.value / 100;
        audioPlayer.volume = volume;
        volumeSlider.value = this.value; // volumeSlider 값을 동일하게 설정
    });
}

function initializeVolumeSliders() {
    const initialVolume = 50; // 초기 볼륨 값을 설정 (0-100)
    volumeSlider.value = initialVolume;
    mainVolumeSlider.value = initialVolume;
    audioPlayer.volume = initialVolume / 100;
}

document.addEventListener('DOMContentLoaded', function () {
    addVolumeControlListener();
    initializeVolumeSliders();
});

bindingEnButton.addEventListener('click', function () {
    bindingKr.style.display = 'none';
    bindingEn.style.display = 'block';
});

bindingKrButton.addEventListener('click', function () {
    bindingKr.style.display = 'block';
    bindingEn.style.display = 'none';
});


soundButton.addEventListener('click', function () {
    soundContainer.style.display = 'block';
    soundButton.style.display = 'none';
    reButton.style.display = 'none';
    mainButton.style.display = 'none';
});

htpButton.addEventListener('click', function () {
    htpContainer.style.display = 'block';
    soundButton.style.display = 'none';
    reButton.style.display = 'none';
    mainButton.style.display = 'none';
});

soundExit.addEventListener('click', function () {
    soundButton.style.display = 'block';
    reButton.style.display = 'block';
    mainButton.style.display = 'block';
    soundContainer.style.display = 'none';
});


exitButton.addEventListener('click', function () {
    optionMenu.style.display = 'none';
});

htpExitButton.addEventListener('click', function () {
    htpContainer.style.display = 'none';
});

document.querySelector(".option-button").addEventListener("click", function () {
    optionMenu.style.display = "block";
});

document.querySelectorAll('.select-music > .first-music, .select-music > .second-music, .select-music > .third-music, .select-music > .fourth-music').forEach(musicButton => {
    musicButton.addEventListener('click', function() {
        const musicPath = `music/theme${this.innerText}.mp3`;
        saveMusic = musicPath;
        playMusic(musicPath);
    });
});


document.querySelector(".start-button").addEventListener("click", () => {
    init();
    document.querySelector(".game-start").style.display = "none";
    document.querySelector(".playground").style.display = "inline-block";
    document.querySelector(".score-container").style.display = "block";
    document.querySelector(".next-blocks").style.display = "inline-block";
    document.querySelector(".level-container").style.display = "block";
    document.querySelector(".line-container").style.display = "block";
    document.querySelector(".keep-container").style.display = "block";
});

function showSpeedUpText() {
    speedUpText.classList.add("show");
    speedUpText.classList.remove("hide");
    setTimeout(() => {
        speedUpText.classList.add("hide");
        setTimeout(() => {
            speedUpText.classList.remove("show");
        }, 500);
    }, 1000);
}

let gameInterval;

function init() {
    gameText.style.display = "none";
    const musicToPlay = saveMusic || "music/theme1.mp3";
    playMusic(musicToPlay);
    gameOver = 0;
    duration = 1250;
    initCount++;
    clearInterval(gameInterval);
    tempMovingItem = { ...movingItem };
    const levelDisplay = document.querySelector(".level");
    levelDisplay.innerText = "1";
    const lineDisplay = document.querySelector(".line");
    lineDisplay.innerText = "0";
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }
    for (let i = 0; i < 3; i++) {
        nextBlocks.push(generateRandomBlock());
    }
    function stopDuration() {
        if (duration <= 350) {
            duration = 350;
        }
    }

    const intervals = [30, 90, 150, 210, 270, 330, 390, 450, 510, 570, 630]; // 초 단위
    let gametime = 0;

    function checkIntervals() {
        console.log(`Current gametime: ${gametime}`);
        console.log(`Current intervals: ${intervals}`);
        console.log(`블럭 속도: ${duration}`);
        for (let i = 0; i < intervals.length; i++) {
            if (gametime >= intervals[i]) {
                const currentInterval = intervals[i];
                console.log(`Triggering event for interval: ${currentInterval}`);
                duration -= 100;
                stopDuration();
                const levelDisplay = document.querySelector(".level");
                levelDisplay.innerText = parseInt(levelDisplay.innerText) + 1;
                showSpeedUpText();
                intervals.splice(0, 1);
            } else {
                break;
            }
        }
    }

    function renderKeepBlock() {
        keepContainer.innerHTML = "";
        for (let i = 0; i < PREVIEW_ROWS; i++) {
            const previewRow = document.createElement("ul");
            for (let j = 0; j < PREVIEW_COLS; j++) {
                const cell = document.createElement("li");
                previewRow.appendChild(cell);
            }
            keepContainer.appendChild(previewRow);
        }
    }

    function increaseGametime() {
        if(gameOver >= 1) return;
        if (!isPaused) {
            gametime += 1; // isPaused가 false일 때만 증가
            checkIntervals(); // 각 interval에 도달했는지 확인
        }
    }

    // 게임 타이머를 시작하는 함수
    function startGameTimer() {
        clearInterval(gameInterval); // 기존 인터벌이 있으면 지웁니다.
        gameInterval = setInterval(increaseGametime, 1000);
    }

    renderNextBlocks();
    startGameTimer();
    renderKeepBlock()
    generateNewBlock(); 
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    });
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tempMovingItem = { ...movingItem };
            if (moveType === 'retry') {
                clearInterval(downInterval);
                showGameOverText();
            }
            setTimeout(() => {
                renderBlocks('retry');
                if (moveType === "top") {
                    seizeBlock();
                }
            }, 0);
            return true;
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;

    renderShadow(); // 실루엣 렌더링 추가
}

function renderShadow() {
    const { type, direction, left } = tempMovingItem;
    let top = tempMovingItem.top;
    const shadowClass = 'shadow';

    // 기존 그림자 제거
    document.querySelectorAll(`.${shadowClass}`).forEach(block => block.classList.remove(shadowClass));

    while (true) {
        top++;
        const isCollision = BLOCKS[type][direction].some(block => {
            const x = block[0] + left;
            const y = block[1] + top;
            const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
            return !checkEmpty(target);
        });

        if (isCollision) {
            top--;
            break;
        }
    }

    BLOCKS[type][direction].forEach(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y]?.childNodes[0].childNodes[x];
        if (target) {
            target.classList.add(shadowClass);
        }
    });
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    score += 50;
    scoreDisplay.innerText = score;
    dropSound();
    checkMatch();
}

function checkMatch() {
    const childNodes = playground.childNodes;
    let linesCleared = 0;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains('seized')) {
                matched = false;
            }
        });
        if (matched) {
            // 각 li에 rotate 클래스 추가
            child.children[0].childNodes.forEach(li => {
                li.classList.add('rotate');
            });
            setTimeout(() => {
                // 애니메이션 후에 요소 제거
                child.remove();
                prependNewLine();
            }, 400); // 애니메이션 시간을 고려하여 setTimeout 사용
            linesCleared++;
        }
    });

    if (linesCleared > 0) {
        matchedSound();
        const lineDisplay = document.querySelector(".line");
        const currentLine = parseInt(lineDisplay.innerText);
        const multiplier = 1 + (linesCleared * 0.5);
        const lineScore = 100 * multiplier * linesCleared;
        score += lineScore;
        scoreDisplay.innerText = score;
        lineDisplay.innerText = currentLine + linesCleared;
    }

    generateNewBlock();
}
function generateNewBlock() {
    clearInterval(downInterval);
    const nextBlock = nextBlocks.shift();
    movingItem.type = nextBlock.type;
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };

    nextBlocks.push(generateRandomBlock());
    renderNextBlocks();
    renderBlocks();

    isHoldUsed = false; // 새로운 블록이 생성될 때 홀드 플래그를 초기화
    downInterval = setInterval(() => {
        moveBlock('top', 1);
    }, duration);
}

function generateRandomBlock() {
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    return { type: blockArray[randomIndex][0], direction: 0 };
}

function renderNextBlocks() {
    nextBlocksContainer.forEach((container, index) => {
        container.innerHTML = "";
        const block = nextBlocks[index];
        if (block) {
            for (let i = 0; i < PREVIEW_ROWS; i++) {
                const previewRow = document.createElement("ul");
                for (let j = 0; j < PREVIEW_COLS; j++) {
                    const cell = document.createElement("li");
                    previewRow.appendChild(cell);
                }
                container.appendChild(previewRow);
            }
            BLOCKS[block.type][0].forEach(cell => {
                const x = block.type === 'bar' ? cell[0] - 1 : block.type === 'square' ? cell[0] + 1 : cell[0];
                const y = cell[1];
                const target = container.childNodes[y] ? container.childNodes[y].childNodes[x] : null;
                if (target) {
                    target.classList.add("outline");
                    target.classList.add(block.type);
                }
            });
        }
    });
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function moveBlock(moveType, amount) {
    if (isPaused) return; // 일시 정지 상태에서는 블록 이동을 무시
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    if (isPaused) return; // 일시 정지 상태에서는 방향 변경을 무시
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

function dropBlock() {
    if (isPaused) return; // 일시 정지 상태에서는 블럭 떨어뜨리기를 무시

    clearInterval(downInterval);

    // 실루엣 위치까지 블럭을 이동
    while (true) {
        tempMovingItem.top++;
        const isCollision = BLOCKS[tempMovingItem.type][tempMovingItem.direction].some(block => {
            const x = block[0] + tempMovingItem.left;
            const y = block[1] + tempMovingItem.top;
            const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
            return !checkEmpty(target);
        });

        if (isCollision) {
            tempMovingItem.top--;
            break;
        }
    }

    // 블럭을 최종 위치에 배치
    renderBlocks();
    seizeBlock();
}

function showGameOverText() {
    if(gameOver == 1){
        gameOverSound();
    }
    gameText.style.display = "flex";
    clearInterval(downInterval);
    gameOver += 1;
    audioPlayer.pause();
}

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    score = 0;
    scoreDisplay.innerText = score;
    nextBlocks = [];
    for (let i = 0; i < 3; i++) {
        nextBlocks.push(generateRandomBlock());
    }
    renderNextBlocks();
    init();
});


reButton.addEventListener("click", () => {
    if (isPaused) {
        // 게임이 일시 정지된 경우 게임 종료 후 다시 시작
        isPaused = false;
        pauseContainer.style.display = "none";
        clearInterval(downInterval); // 현재 진행 중인 게임 종료
        playground.innerHTML = ""; // 게임 영역 비우기
        gameText.style.display = "none"; // 게임 오버 텍스트 숨기기
        score = 0; // 점수 초기화
        scoreDisplay.innerText = score; // 화면에 점수 표시
        nextBlocks = []; // 다음 블록 초기화
        for (let i = 0; i < 3; i++) {
            nextBlocks.push(generateRandomBlock());
        }
        renderNextBlocks(); // 다음 블록 미리보기 업데이트
        init(); // 게임 다시 시작
    }
});


document.addEventListener("keydown", e => {
    if (gameOver >= 1) return
    if (e.keyCode === 27) { // ESC 키를 눌렀을 때
        if (!isPaused) {
            audioPlayer.pause();
            pauseContainer.style.display = "block";
            soundButton.style.display = "block"
            reButton.style.display = "block"
            mainButton.style.display = "block"
            isPaused = true;
            clearInterval(downInterval); // 블록이 더 이상 떨어지지 않도록
        } else {
            audioPlayer.play();
            soundContainer.style.display = "none";
            pauseContainer.style.display = "none";
            isPaused = false;
            downInterval = setInterval(() => {
                moveBlock("top", 1);
            }, duration);
        }
    }

    if (isPaused) return; // 일시 정지 상태에서는 키 입력을 무시

    if (e.ctrlKey) { // Ctrl 키를 눌렀을 때
        holdBlock();
    }
    switch (e.keyCode) {
        case 39:
            moveBlock("left", 1);
            moveSound();
            break;
        case 37:
            moveBlock("left", -1);
            moveSound();
            break;
        case 40:
            moveBlock("top", 1);
            moveSound();
            break;
        case 38:
            rotateSound();
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
});

let isHoldUsed = false; // 홀드 사용 여부를 추적하는 변수

function holdBlock() {

    if (isHoldUsed) {
        notHoldSound();
        return;
    }; // 이미 홀드한 경우 함수를 종료

    const movingBlocks = document.querySelectorAll(".moving");

    if (!holdItem) { // keep-block 안에 블록이 없는 경우
        holdSound();
        holdItem = { ...movingItem }; // 현재 블록을 holdItem에 저장
        movingBlocks.forEach(moving => {
            moving.classList.remove("moving");
            moving.classList.remove(holdItem.type);
        });
        generateNewBlock(); // 새로운 블록 생성
        renderHoldBlock(); // hold-block 렌더링
    } else { // keep-block 안에 블록이 있는 경우
        holdSound();
        const currentHoldItem = { ...holdItem }; // holdItem을 임시 저장
        holdItem = { ...movingItem }; // 현재 블록을 holdItem에 저장
        movingBlocks.forEach(moving => {
            moving.classList.remove("moving");
            moving.classList.remove(holdItem.type);
        });

        movingItem.type = currentHoldItem.type;
        movingItem.direction = currentHoldItem.direction;
        movingItem.top = 1;
        movingItem.left = 3;
        tempMovingItem = { ...movingItem };
        renderBlocks(); // 현재 블록을 keep-block으로 옮기기
        renderHoldBlock(); // hold-block 렌더링
    }

    isHoldUsed = true; // 블록을 홀드한 후 플래그를 true로 설정
}

function renderHoldBlock() {
    keepContainer.innerHTML = "";
    for (let i = 0; i < PREVIEW_ROWS; i++) {
        const previewRow = document.createElement("ul");
        for (let j = 0; j < PREVIEW_COLS; j++) {
            const cell = document.createElement("li");
            previewRow.appendChild(cell);
        }
        keepContainer.appendChild(previewRow);
    }
    BLOCKS[holdItem.type][0].forEach(cell => {
        const x = holdItem.type === 'bar' ? cell[0] - 1 : holdItem.type === 'square' ? cell[0] + 1 : cell[0];
        const y = cell[1];
        const target = keepContainer.childNodes[y] ? keepContainer.childNodes[y].childNodes[x] : null;
        if (target) {
            target.classList.add("outline");
            target.classList.add(holdItem.type);
        }
    });
}

mainButton.addEventListener("click", () => {
    audioPlayer.pause();
    if (isPaused) {
    isPaused = false;
    pauseContainer.style.display = "none";
    clearInterval(downInterval); // 블록 떨어지는 간격을 제어하는 인터벌 중지
    gameOver += 1 ;
    playground.innerHTML = "";
    gameText.style.display = "none";
    score = 0;
    scoreDisplay.innerText = score;
    document.querySelector(".game-start").style.display = "block";
    document.querySelector(".playground").style.display = "none";
    document.querySelector(".score-container").style.display = "none";
    document.querySelector(".next-blocks").style.display = "none";
    document.querySelector(".level-container").style.display = "none";
    document.querySelector(".line-container").style.display = "none";
    document.querySelector(".keep-container").style.display = "none";
}
}); 


