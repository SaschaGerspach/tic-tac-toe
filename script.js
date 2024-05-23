let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle"; // Spieler beginnt mit Kreis

function render() {
    const content = document.getElementById("content");
    const tableSize = 3;
    let tablehtml = "<table>";

    for (let i = 0; i < tableSize; i++) {
        tablehtml += "<tr>";
        for (let j = 0; j < tableSize; j++) {
            const index = i * tableSize + j;
            const value = fields[index];
            let displayValue = "";
            if (value === "circle") {
                displayValue = generateAnimatedCircleSVG();
            } else if (value === "cross") {
                displayValue = generateAnimatedCrossSVG();
            }
            tablehtml += `<td data-index="${index}" onclick="addSymbol(${index}, this)">${displayValue}</td>`;
        }
        tablehtml += "</tr>";
    }
    tablehtml += "</table>";

    content.innerHTML = tablehtml;
}

function addSymbol(index, cell) {
    if (!fields[index]) {
        fields[index] = currentPlayer;
        const displayValue = currentPlayer === "circle" ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
        cell.innerHTML = displayValue;
        cell.onclick = null;

        const winningCombination = checkWin(currentPlayer);
        if (winningCombination) {
            setTimeout(() => {
                drawWinningLine(winningCombination);
                showRestartButton();
            }, 500); // Warten auf Animation
        } else if (fields.every(field => field !== null)) {
            showRestartButton(); // Alle Felder gefüllt, Spiel endet unentschieden
        } else {
            currentPlayer = currentPlayer === "circle" ? "cross" : "circle"; // Spielerwechsel
        }
    }
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentPlayer = "circle";
    render();
    document.getElementById("restart-button").style.display = "none";
}




function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        if (combination.every(index => fields[index] === player)) {
            return combination;
        }
    }
    return null;
}

function drawWinningLine(winningCombination) {
    const [first, , third] = winningCombination;
    const firstCell = document.querySelector(`td[data-index="${first}"]`);
    const thirdCell = document.querySelector(`td[data-index="${third}"]`);

    const line = document.createElement("div");
    line.className = "line";

    const startX = firstCell.offsetLeft + firstCell.offsetWidth / 2 - firstCell.getBoundingClientRect().left;
    const startY = firstCell.offsetTop + firstCell.offsetHeight / 2 - firstCell.getBoundingClientRect().top;
    const endX = thirdCell.offsetLeft + thirdCell.offsetWidth / 2 - firstCell.getBoundingClientRect().left;
    const endY = thirdCell.offsetTop + thirdCell.offsetHeight / 2 - firstCell.getBoundingClientRect().top;

    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = "0 0";
    line.style.top = `${startY}px`;
    line.style.left = `${startX}px`;

    firstCell.appendChild(line);
}

function showRestartButton() {
    document.getElementById("restart-button").style.display = "block";
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentPlayer = "circle";
    document.querySelectorAll(".line").forEach(line => line.remove());
    render();
    document.getElementById("restart-button").style.display = "none";
}


function generateAnimatedCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#00B0EF" stroke-width="5" fill="none" />
            <circle cx="50" cy="50" r="45" fill="#00B0EF">
                <animate attributeName="r" from="0" to="45" dur="0.5s" fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateAnimatedCrossSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <line x1="15" y1="15" x2="85" y2="85" stroke="#FFC000" stroke-width="5">
                <animate attributeName="stroke-dasharray" from="0, 100" to="100, 100" dur="0.5s" fill="freeze" />
            </line>
            <line x1="85" y1="15" x2="15" y2="85" stroke="#FFC000" stroke-width="5">
                <animate attributeName="stroke-dasharray" from="0, 100" to="100, 100" dur="0.5s" fill="freeze" />
            </line>
        </svg>
    `;
}

render(); // Initialisiere das Spielbrett beim Laden der Seite
