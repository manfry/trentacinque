const boardElement = document.getElementById('board');
const winScreenElement = document.getElementById('win-screen');
const shuffleBtn = document.getElementById('shuffle-btn');

const winningState = Array.from({ length: 15 }, (_, i) => i + 1).concat(0);
let state = [...winningState];

function getRowCol(index) {
    return { row: Math.floor(index / 4), col: index % 4 };
}

function isAdjacent(index1, index2) {
    const a = getRowCol(index1);
    const b = getRowCol(index2);
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function handleTileClick(index) {
    const emptyIndex = state.indexOf(0);
    if (!isAdjacent(index, emptyIndex)) return;

    [state[index], state[emptyIndex]] = [state[emptyIndex], state[index]];
    render();
    checkWin();
}

// Mescola con sole mosse legali: il puzzle resta sempre risolvibile.
function shuffle() {
    state = [...winningState];
    let previousEmpty = -1;

    for (let i = 0; i < 500; i++) {
        const emptyIndex = state.indexOf(0);
        let validMoves = Array.from({ length: 16 }, (_, j) => j)
            .filter(j => isAdjacent(j, emptyIndex) && j !== previousEmpty);
        if (validMoves.length === 0) {
            validMoves = Array.from({ length: 16 }, (_, j) => j)
                .filter(j => isAdjacent(j, emptyIndex));
        }
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        [state[emptyIndex], state[move]] = [state[move], state[emptyIndex]];
        previousEmpty = emptyIndex;
    }

    winScreenElement.style.display = 'none';
    boardElement.style.display = 'grid';
    render();
}

function checkWin() {
   // if (state.every((value, index) => value === winningState[index])) {
        boardElement.style.display = 'none';
        winScreenElement.style.display = 'block';
   // }
}

function render() {
    boardElement.innerHTML = '';
    state.forEach((value, index) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'tile';

        if (value === 0) {
            tile.classList.add('empty');
            tile.disabled = true;
            tile.setAttribute('aria-label', 'Casella vuota');
        } else {
            const imageIndex = value - 1;
            const row = Math.floor(imageIndex / 4);
            const col = imageIndex % 4;
            tile.style.backgroundPosition = `${col * 100 / 3}% ${row * 100 / 3}%`;
            tile.setAttribute('aria-label', `Frammento ${value}`);
            tile.addEventListener('click', () => handleTileClick(index));
        }
        boardElement.appendChild(tile);
    });
}

shuffleBtn.addEventListener('click', shuffle);
shuffle();
