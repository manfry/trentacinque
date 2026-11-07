// Ogni coppia contiene due immagini diverse appartenenti allo stesso gruppo.
// Sostituisci i placeholder nel metodo createTile() con i tuoi file immagine.
const groups = [
  { id: 'gr1', type: 'image', items: [{ label: 'Gru', src: 'cme1.png' }, { label: 'Dru', src: 'cme2.png' }] },
  { id: 'gr2', type: 'image', items: [{ label: '♊︎', src: 'gem1.png' }, { label: '♊︎', src: 'gem2.png' }] },
  { id: 'gr3', type: 'image', items: [{ label: 'James', src: 'heb1.png' }, { label: 'Jason', src: 'heb2.png' }] },
  { id: 'gr4', type: 'image', items: [{ label: 'Patty', src: 'sim1.png' }, { label: 'Selma', src: 'sim2.png' }] },
  { id: 'gr5', type: 'image', items: [{ label: 'C-17', src: 'drb1.png' }, { label: 'C-18', src: 'drb2.png' }] },
  { id: 'gr6', type: 'image', items: [{ label: 'Yuichiro', src: 'dem1.png' }, { label: 'Muichiro', src: 'dem2.png' }] }
];

const board = document.querySelector('#board');
const movesElement = document.querySelector('#moves');
const progressText = document.querySelector('#progress-text');
const progressFill = document.querySelector('#progress-fill');
const winMessage = document.querySelector('#win-message');
const gameInfo = document.querySelector('#game-info');
const restartButton = document.querySelector('#restart');
const playAgainButton = document.querySelector('#play-again');

let firstTile = null;
let secondTile = null;
let locked = false;
let moves = 0;
let matchedGroups = 0;
let mismatchTimer = null;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createTile(item) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'tile';
  tile.dataset.group = item.group;
  tile.dataset.label = item.label;
  tile.setAttribute('aria-label', 'Tessera coperta');
  tile.setAttribute('aria-pressed', 'false');

  // PLACEHOLDER IMMAGINE:
  // Per usare un'immagine reale, sostituisci il contenuto di .tile-front con:
  // <img src="images/nome-file.png" alt="Descrizione dell'immagine">
  let html = `
    <span class="tile-inner">
      <span class="tile-face tile-back" aria-hidden="true">*</span>
      <span class="tile-face tile-front">
        <span class="placeholder">`;
  if (item.type === "image") {
    html += `
          <span class="emoji" aria-hidden="true"><img src="images/${item.src}" alt="${item.label}"></span>
          <small>${item.label}</small>`;
  } else {
    html += `
          <span class="emoji" aria-hidden="true">${item.emoji}</span>
          <small>${item.label}</small>`;
  }
  html += `
        </span>
      </span>
    </span>`;
  tile.innerHTML = html;
  tile.addEventListener('click', () => flipTile(tile));
  return tile;
}

function startGame() {
  clearTimeout(mismatchTimer);
  firstTile = null;
  secondTile = null;
  locked = false;
  moves = 0;
  matchedGroups = 0;
  movesElement.textContent = '0';
  progressText.textContent = '0 / 6 coppie';
  progressFill.style.width = '0%';
  winMessage.hidden = true;
  gameInfo.hidden = !winMessage.hidden;
  board.innerHTML = '';

  const cards = groups.flatMap(group =>
    group.items.map(item => ({ ...item, group: group.id, type: group.type }))
  );

  shuffle(cards).forEach(item => board.appendChild(createTile(item)));
}

function flipTile(tile) {
  if (locked || tile === firstTile || tile.classList.contains('is-flipped') || tile.classList.contains('is-matched')) {
    return;
  }

  tile.classList.add('is-flipped');
  tile.setAttribute('aria-pressed', 'true');
  tile.setAttribute('aria-label', `${tile.dataset.label}, ${tile.dataset.group}`);

  if (!firstTile) {
    firstTile = tile;
    return;
  }

  secondTile = tile;
  moves++;
  movesElement.textContent = moves;

  if (firstTile.dataset.group === secondTile.dataset.group) {
    firstTile.classList.add('is-matched');
    secondTile.classList.add('is-matched');
    firstTile.disabled = true;
    secondTile.disabled = true;
    matchedGroups++;
    progressText.textContent = `${matchedGroups} / 6 coppie`;
    progressFill.style.width = `${(matchedGroups / groups.length) * 100}%`;
    resetTurn();

    if (matchedGroups === groups.length) {
      winMessage.hidden = false;
      gameInfo.hidden = !winMessage.hidden;
    }
  } else {
    locked = true;
    mismatchTimer = setTimeout(() => {
      [firstTile, secondTile].forEach(card => {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
        card.setAttribute('aria-label', 'Tessera coperta');
      });
      resetTurn();
    }, 850);
  }
}

function resetTurn() {
  firstTile = null;
  secondTile = null;
  locked = false;
}

restartButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

startGame();
