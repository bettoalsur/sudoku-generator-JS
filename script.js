
let grid = [];
let originalGrid;

for (let i = 0 ; i < 81 ; i++) {
    grid.push(0);
}

originalGrid = grid.map(x => x);

let allNumbers = [1,2,3,4,5,6,7,8,9];
let sectorMainIndexes = [0,3,6, 27,30,33, 54,57,60];
let sectorIterationIndexes = [0,1,2, 9,10,11, 18,19,20];

function consoleMatrix (matrix) {
    for ( let j = 0 ; j < 9 ; j++ ){
        let row = matrix.slice(j*9 , (j+1)*9 );
        console.log(row);
    }
}

function lookForNumbers() {
    
    let foundNumbers = [];
    
    for (let num = 1 ; num <= 9 ; num++) {
    
        let gridCopy = grid.map(x => x);
    
        for (let j = 0 ; j < 9 ; j ++) {
            for (let i = 0 ; i < 9 ; i++) {
                let index = i + j*9;
                if (grid[index] == num) {
                    // for that row
                    for (let k = j*9 ; k < (j+1)*9 ; k ++ ) {
                        gridCopy[k] = 10;
                    }
                    // for that column
                    for (let k = i ; k < 81 ; k += 9 ) {
                        gridCopy[k] = 10;
                    }
                    // for that sector  
                    let sectorIndex = Math.trunc(i/3)*3 + Math.trunc(j/3)*3 * 9
                    for (let k of sectorIterationIndexes) {
                        gridCopy[sectorIndex+k] = 10;
                    }
                } else if (grid[index] != 0) {
                    gridCopy[index] = 10;
                }
            }
        }
    
        for (let j = 0 ; j < 9 ; j ++) {
            let accRow = 0;
            let accColumn = 0;
            let accSector = 0;
            for (let i = 0 ; i < 9 ; i++) {
                let indexForColumn = j + i*9;
                let indexForRow = i + j*9;
                let indexForSector = sectorMainIndexes[j] + sectorIterationIndexes[i];
                accRow += gridCopy[indexForRow];
                accColumn += gridCopy[indexForColumn];
                accSector += gridCopy[indexForSector];
            }
            if (accRow == 80) {
                for (let i = 0 ; i < 9 ; i++) {
                    let index = i + j*9;
                    if (gridCopy[index] == 0) foundNumbers.push( { index , num } );
                }
            }
            if (accColumn == 80) {
                for (let i = 0 ; i < 9 ; i++) {
                    let index = j + i*9;
                    if (gridCopy[index] == 0) foundNumbers.push( { index , num } );
                }
            }
            if (accSector == 80) {
                for (let i = 0 ; i < 9 ; i++) {
                    let index = sectorMainIndexes[j] + sectorIterationIndexes[i];
                    if (gridCopy[index] == 0) foundNumbers.push( { index , num } );
                }
            }
        }
    }

    if (foundNumbers.length == 0) return;

    foundNumbers.forEach(found => grid[found.index] = found.num );
    lookForNumbers();
}

function lookForMissingNumbers() {

    let foundNumbers = [];

    for (let j = 0; j < 9 ; j++) {
        let rowNumbers = [];
        let colNumbers = [];
        let secNumbers = [];
        for (let i = 0; i < 9 ; i++) {
            let indexForRow = i + j*9;
            let indexForColumn = j + i*9;
            let indexForSector = sectorMainIndexes[j] + sectorIterationIndexes[i];
            rowNumbers.push(grid[indexForRow]);
            colNumbers.push(grid[indexForColumn]);
            secNumbers.push(grid[indexForSector]);
        }

        // for rows...
        let rowMissingNumbers = [];
        let rowMissingIndexes = [];
        // for columns...
        let colMissingNumbers = [];
        let colMissingIndexes = [];
        // for sector...
        let secMissingNumbers = [];
        let secMissingIndexes = [];

        for (let i = 0; i < 9 ; i++) {
            if ( rowNumbers[i] == 0 ) rowMissingIndexes.push(i);
            if ( !rowNumbers.includes(i+1) ) rowMissingNumbers.push(i+1);
            
            if ( colNumbers[i] == 0 ) colMissingIndexes.push(i);
            if ( !colNumbers.includes(i+1) ) colMissingNumbers.push(i+1);

            if ( secNumbers[i] == 0 ) secMissingIndexes.push(i);
            if ( !secNumbers.includes(i+1) ) secMissingNumbers.push(i+1);
        }
        
        // for row...
        for (let col of rowMissingIndexes) {
            let numbers = rowMissingNumbers.map(x => x);
            let currentSector = Math.trunc(col/3)*3 + Math.trunc(j/3)*3 * 9;
            for (let k = numbers.length - 1 ; k >= 0 ; k --) {
                for (let i = 0; i < 9 ; i++) {
                    let indexForColumn = col + i*9;
                    let indexForSector = currentSector + sectorIterationIndexes[i];
                    if (grid[indexForColumn] == numbers[k] || grid[indexForSector] == numbers[k]) {
                        numbers.splice(k,1);
                        break;
                    }
                }
            }
            if (numbers.length == 1) foundNumbers.push( { index: col+j*9 , num: numbers[0] } );
        }

        // for columns...
        for (let row of colMissingIndexes) {
            let numbers = colMissingNumbers.map(x => x);
            let currentSector = Math.trunc(j/3)*3 + Math.trunc(row/3)*3 * 9;
            for (let k = numbers.length - 1 ; k >= 0 ; k --) {
                for (let i = 0; i < 9 ; i++) {
                    let indexForRow = i + row*9;
                    let indexForSector = currentSector + sectorIterationIndexes[i];
                    if (grid[indexForRow] == numbers[k] || grid[indexForSector] == numbers[k]) {
                        numbers.splice(k,1);
                        break;
                    }
                }
            }
            if (numbers.length == 1) foundNumbers.push( { index: j+row*9 , num: numbers[0] } );
        }

        // for sector...
        for (let indexInSector of secMissingIndexes) {
            let numbers = secMissingNumbers.map(x => x);
            let globalIndex = sectorMainIndexes[j] + sectorIterationIndexes[indexInSector];
            let currentRow = Math.trunc(globalIndex/9);
            let currentCol = globalIndex%9;
            for (let k = numbers.length - 1 ; k >= 0 ; k --) {
                for (let i = 0; i < 9 ; i++) {
                    let indexForRow = i + currentRow*9;
                    let indexForColumn = currentCol + i*9;
                    if (grid[indexForRow] == numbers[k] || grid[indexForColumn] == numbers[k]) {
                        numbers.splice(k,1);
                        break;
                    }
                }
            }
            if (numbers.length == 1) foundNumbers.push( { index: globalIndex , num: numbers[0] } );
        }
    }

    if (foundNumbers.length == 0) return;

    foundNumbers.forEach(found => grid[found.index] = found.num);
    lookForMissingNumbers();
}

function isValidSolution() {
    for (let j = 0 ; j < 9 ; j++) {
        let accColumn = 0;
        let accRow = 0;
        for (let i = 0 ; i < 9 ; i++) {
            let indexForColumn = j + i*9;
            let indexForRow = i + j*9;
            accColumn += grid[indexForColumn];
            accRow += grid[indexForRow];
        }
        if (accColumn!=45 || accRow!=45) {
            return false;
        }
    }
    return true;
}

function wellPlaced() {

    let wellPlaced = true;
    for (let j = 0; j < 9 ; j++) {
    
        let rowNumbers = [];
        let colNumbers = [];
        let secNumbers = [];
    
        for (let i = 0; i < 9 ; i++) {
            let indexForRow = i + j*9;
            let indexForColumn = j + i*9;
            let indexForSector = sectorMainIndexes[j] + sectorIterationIndexes[i];
            rowNumbers.push(grid[indexForRow]);
            colNumbers.push(grid[indexForColumn]);
            secNumbers.push(grid[indexForSector]);
        }

        for (let i = 1; i <= 9 ; i++) {
            if (rowNumbers.filter(num => num===i).length > 1 ||
                colNumbers.filter(num => num===i).length > 1 ||
                secNumbers.filter(num => num===i).length > 1 ) { 
                wellPlaced = false;
                return wellPlaced;
            }
        }
    }
    return wellPlaced;
}

function guessNumbers() {

    for (let j = 0; j < 9 ; j++) {

        let rowNumbers = [];
        let colNumbers = [];
        let secNumbers = [];

        for (let i = 0; i < 9 ; i++) {
            let indexForRow = i + j*9;
            let indexForColumn = j + i*9;
            let indexForSector = sectorMainIndexes[j] + sectorIterationIndexes[i];
            rowNumbers.push(grid[indexForRow]);
            colNumbers.push(grid[indexForColumn]);
            secNumbers.push(grid[indexForSector]);
        }

        // for rows...
        let rowMissingNumbers = [];
        let rowMissingIndexes = [];
        // for columns...
        let colMissingNumbers = [];
        let colMissingIndexes = [];
        // for sector...
        let secMissingNumbers = [];
        let secMissingIndexes = [];

        for (let i = 0; i < 9 ; i++) {
            if ( rowNumbers[i] == 0 ) rowMissingIndexes.push(i);
            if ( !rowNumbers.includes(i+1) ) rowMissingNumbers.push(i+1);
            
            if ( colNumbers[i] == 0 ) colMissingIndexes.push(i);
            if ( !colNumbers.includes(i+1) ) colMissingNumbers.push(i+1);

            if ( secNumbers[i] == 0 ) secMissingIndexes.push(i);
            if ( !secNumbers.includes(i+1) ) secMissingNumbers.push(i+1);
        }

        // for row...
        for (let col of rowMissingIndexes) {
            for (let number of rowMissingNumbers) {
                let gridBackup = grid.map(x => x);
                let index = col + j*9;
                grid[index] = number;
                noGuessingMethods();
                if (isValidSolution()) {
                    return;
                } else {
                    grid = gridBackup;
                }
            }
        }

        // for column...
        for (let row of colMissingIndexes) {
            for (let number of colMissingNumbers) {
                let gridBackup = grid.map(x => x);
                let index = j + row*9;
                grid[index] = number;
                noGuessingMethods();
                if (isValidSolution()) {
                    return;
                } else {
                    grid = gridBackup;
                }
            }
        }

        // for sector...
        for (let indexInSector of secMissingIndexes) {
            for (let number of secMissingNumbers) {
                let gridBackup = grid.map(x => x);
                let index = sectorMainIndexes[j] + sectorIterationIndexes[indexInSector];
                grid[index] = number;
                noGuessingMethods();
                if (isValidSolution()) {
                    return;
                } else {
                    grid = gridBackup;
                }
            }
        }
    }
}

function noGuessingMethods() {
    lookForNumbers();
    lookForMissingNumbers();
}

function solve() {
    
    noGuessingMethods();
    
    if (!isValidSolution()) {
        guessNumbers();
    }
}

// 
// 
// 

function renderGrid() {
    const gridObject = document.querySelector(".grid");
    let content = "";

    let backGroundColor;
    let fontColor;
    let numberToShow;

    for (let row = 0 ; row < 9 ; row++) {
        for (let col = 0 ; col < 9 ; col++) {

            let index = col + row*9;
            let sectorIndex = Math.trunc(col/3)*3 + Math.trunc(row/3)*3 * 9;

            if ( [0,2,4,6,8].map(x => sectorMainIndexes[x]).includes(sectorIndex) ) backGroundColor = "white";
            else backGroundColor = "#D4E6F1";

            if (grid[index] != 0 ) numberToShow = grid[index];
            else numberToShow = "";

            if (originalGrid[index] == 0) fontColor = "rgb(157,157,157)";
            else fontColor = "#151515";

            content += `
                <div class="cell" style="background-color: ${backGroundColor}; color: ${fontColor};">
                    ${numberToShow}
                </div>
            `;
        }
    }
    gridObject.innerHTML = content;
}

function showMessage(message) {
    const messageBox = document.querySelector(".message-box");
    messageBox.textContent = message;
}

let generateBtn = document.querySelector(".button.generate");
generateBtn.addEventListener("click",() => {
    cont = 0;
    do {
        grid = originalGrid.map(x => x);
        cont++;
        generateSudoku();
        solve();
    } while (!isValidSolution() && cont < 100);

    if (isValidSolution()) {
        showMessage(`Your sudoku is ready`);
        renderGrid();
        console.log(cont);
    } else {
        showMessage(`We couldn't generate a sudoku :(`);
    }
});
renderGrid();
showMessage("Ready to start :]")

// 
// 
// 

function addToGrid(arr) {
    let cont = 0;
    for (let i = 0; i < 81 ; i++) {
        if (grid[i] == 0) {
            grid[i] = arr[cont];
            cont ++;
        }
        if ( cont == arr.length) return;
    }
}

function addToGridVertical (arr,colIndex) {
    let cont = 0;
    for (let i = 0; i < 9 ; i++) {
        let globalIndex = colIndex + i*9
        if (grid[globalIndex] == 0) {
            grid[globalIndex] = arr[cont];
            cont ++;
        }
        if ( cont == arr.length) return;
    }
}

function getNumbersInColumn(col) {
    let numbersInCol = [];
    for (let i = 0 ; i < 9 ; i ++) {
        let index = col + i*9;
        if (grid[index] != 0) numbersInCol.push(grid[index]);
    }
    return numbersInCol;
}

function getNumbersInRow(row) {
    let numbersInRow = [];
    for (let i = 0 ; i < 9 ; i ++) {
        let index = i + row*9;
        if (grid[index] != 0) numbersInRow.push(grid[index]);
    }
    return numbersInRow;
}

function getMissingNumbers(arr) {
    let missingNumbers = [];
    allNumbers.forEach(num => {
        if (!arr.includes(num)) missingNumbers.push(num);
    });
    return missingNumbers;
}

function generateSudoku() {

    // // // // //
    /* Stage 1 */
    // // // // //
    
    let gridBackup;
    
    // firstRow
    let firstRow = allNumbers.map(x => x).sort(() => Math.random() - 0.5);
    addToGrid(firstRow);
    
    // secondRow 
    let secondRowP1, secondRowP2, secondRowP3;
    gridBackup = grid.map(x => x);
    let cont = 0;
    do {
        grid = gridBackup.map(x => x);
    
        secondRowP1 = firstRow.slice(3,9).sort(() => Math.random() - 0.5).slice(0,3);
        secondRowP2 = getMissingNumbers( secondRowP1.concat(firstRow.slice(3,6)) ).sort(() => Math.random() - 0.5).slice(0,3);
        secondRowP3 = getMissingNumbers( secondRowP1.concat(secondRowP2) ).sort(() => Math.random() - 0.5);
        addToGrid(secondRowP1);
        addToGrid(secondRowP2);
        addToGrid(secondRowP3);
        cont++;
    
    } while (!wellPlaced());
    
    // third row
    let thirdRowP1 = getMissingNumbers( secondRowP1.concat(firstRow.slice(0,3)) ).sort(() => Math.random() - 0.5);
    let thirdRowP2 = getMissingNumbers( secondRowP2.concat(firstRow.slice(3,6)) ).sort(() => Math.random() - 0.5);
    let thirdRowP3 = getMissingNumbers( secondRowP3.concat(firstRow.slice(6,9)) ).sort(() => Math.random() - 0.5);
    addToGrid(thirdRowP1);
    addToGrid(thirdRowP2);
    addToGrid(thirdRowP3);
    
    // firstColumn
    let firstColumnP1 = getNumbersInColumn(0);
    let firstColumnP2P3 = getMissingNumbers( firstColumnP1 ).sort(() => Math.random() - 0.5);
    addToGridVertical(firstColumnP2P3,0);
    
    // secondColumn
    let secondColumnP1 = getNumbersInColumn(1);
    let secondColumnP2, secondColumnP3;
    gridBackup = grid.map(x => x);
    cont = 0;
    do {
        grid = gridBackup.map(x => x);
    
        secondColumnP2 = getMissingNumbers( secondColumnP1.concat(firstColumnP2P3.slice(0,3)) ).sort(() => Math.random() - 0.5).slice(0,3);
        secondColumnP3 = getMissingNumbers( secondColumnP1.concat(secondColumnP2) ).sort(() => Math.random() - 0.5);
        addToGridVertical(secondColumnP2,1);
        addToGridVertical(secondColumnP3,1);
        cont++;
    
    } while (!wellPlaced());
    
    // thirdColumn
    let thirdColumnP2, thirdColumnP3;
    gridBackup = grid.map(x => x);
    cont = 0;
    do {
        grid = gridBackup.map(x => x);
    
        thirdColumnP2 = getMissingNumbers( secondColumnP2.concat(firstColumnP2P3.slice(0,3)) ).sort(() => Math.random() - 0.5);
        thirdColumnP3 = getMissingNumbers( secondColumnP3.concat(firstColumnP2P3.slice(3,6)) ).sort(() => Math.random() - 0.5);
        addToGridVertical(thirdColumnP2,2);
        addToGridVertical(thirdColumnP3,2);
        cont++;
    
    } while (!wellPlaced());
    
    // // // // //
    /* Stage 2 */
    // // // // //
    
    // fourth row
    let row4col4 = getMissingNumbers( getNumbersInRow(3).concat( getNumbersInColumn(3) ) );
    row4col4 = row4col4.sort(() => Math.random() - 0.5).slice(0,1);
    addToGridVertical(row4col4,3);
    
    let row4col5 = getMissingNumbers( getNumbersInRow(3).concat( getNumbersInColumn(4) ) );
    row4col5 = row4col5.sort(() => Math.random() - 0.5).slice(0,1);
    addToGridVertical(row4col5,4);
    
    let row4col6 = getMissingNumbers( getNumbersInRow(3).concat( getNumbersInColumn(5) ) );
    row4col6 = row4col6.sort(() => Math.random() - 0.5).slice(0,1);
    addToGridVertical(row4col6,5);
    
    // seventh row
    let row7col4 = getMissingNumbers( getNumbersInRow(6).concat( getNumbersInColumn(3) ) );
    row7col4 = row7col4.sort(() => Math.random() - 0.5).slice(0,1);
    grid[3+6*9] = row7col4[0];
    
    let row7col5 = getMissingNumbers( getNumbersInRow(6).concat( getNumbersInColumn(4) ) );
    row7col5 = row7col5.sort(() => Math.random() - 0.5).slice(0,1);
    grid[4+6*9] = row7col5[0];
}












