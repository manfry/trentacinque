const boardElement = document.getElementById('board');
const winScreenElement = document.getElementById('win-screen');
const shuffleBtn = document.getElementById('shuffle-btn');

let state = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
const winningState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

// Trova le coordinate (riga, colonna) dato l'indice
function getRowCol(index) {
    return {
        row: Math.floor(index / 4),
        col: index % 4
    };
}

// Controlla se due tessere sono adiacenti (orizzontalmente o verticalmente)
function isAdjacent(index1, index2) {
    const pos1 = getRowCol(index1);
    const pos2 = getRowCol(index2);
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff + colDiff === 1);
}

// Gestisce il click su una tessera
function handleTileClick(index) {
    const emptyIndex = state.indexOf(0);
    if (isAdjacent(index, emptyIndex)) {
        // Scambia la tessera cliccata con lo spazio vuoto
        state[emptyIndex] = state[index];
        state[index] = 0;
        render();
        checkWin();
    }
}

// Mescola il gioco effettuando mosse casuali valide (garantisce che sia risolvibile)
function shuffle() {
    for (let i = 0; i < 1000; i++) {
        const emptyIndex = state.indexOf(0);
        const validMoves = [];

        for (let j = 0; j < 16; j++) {
            if (isAdjacent(j, emptyIndex)) {
                validMoves.push(j);
            }
        }

        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        state[emptyIndex] = state[randomMove];
        state[randomMove] = 0;
    }
    
    // Assicura che la schermata di vittoria sia nascosta se si rimischia
    winScreenElement.style.display = 'none';
    boardElement.style.display = 'grid';
    render();
}

// Controlla se lo stato attuale corrisponde alla vittoria
function checkWin() {
     const isWon = state.every((val, idx) => val === winningState[idx]);
     if (isWon) {
        boardElement.style.display = 'none';
        winScreenElement.style.display = 'block';
     }
}

// Disegna la griglia a schermo
function render() {
    boardElement.innerHTML = '';
    state.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (value === 0) {
            tile.classList.add('empty');
        } else {
            tile.textContent = value;
            tile.addEventListener('click', () => handleTileClick(index));
        }
        boardElement.appendChild(tile);
    });
}

shuffleBtn.addEventListener('click', shuffle);

// Avvia il gioco mescolando all'avvio
shuffle();