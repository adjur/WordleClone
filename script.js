const possibleWords = ['blink'/*, 'point', 'indie'*/]
let secretWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
let userGuess = [];
let pastGuesses = [];
const boxes = document.querySelectorAll('.box');
let rows = document.querySelectorAll('.row')
let currentRowIndex = 0;
const currentRowBoxes = rows[currentRowIndex].querySelectorAll('.box')
const availableLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'


document.addEventListener('keydown', function (event) {
    const key = event.key.toUpperCase();
    if (event.key === 'Enter') {
        event.preventDefault();
        submitGuess();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        if (userGuess.length > 0) {
            userGuess.pop();
        }
    } else if (availableLetters.includes(key) && userGuess.length < 5) {
        userGuess.push(key);
    }
    updateBoxes();
});

function updateBoxes() {
    pastGuesses.forEach((guess, index) => {
        const currentRowBoxes = rows[index].querySelectorAll('.box')
        currentRowBoxes.forEach((box, i) => {
            box.innerText = guess[i]
        })
    })
    if (currentRowIndex < rows.length) {
        const currentRowBoxes = rows[currentRowIndex].querySelectorAll('.box');
        currentRowBoxes.forEach((box, i) => {
            box.innerText = userGuess[i] || '';
        });
    }
};

function submitGuess() {
    if (userGuess.length === 5) {
        letterCheck(secretWord, userGuess);
        pastGuesses.push([...userGuess]);
        userGuess = [];
        updateBoxes()
        // currentRowIndex++
        if (++currentRowIndex < rows.length) {
            updateBoxes()
            // } else {
            //     alert(secretWord)
            //     currentRowIndex = 0;
        }
    } else {
        alert("Please enter 5 letters.")
    }
    console.log(pastGuesses, secretWord)
}

//GAME LOGIC//
function letterCheck(secretWord, userGuess) {
    const currentRowBoxes = rows[currentRowIndex].querySelectorAll('.box');
    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === userGuess[i]) {
            currentRowBoxes[i].style.backgroundColor = 'green';
        } else if (secretWord.includes(userGuess[i])) {
            currentRowBoxes[i].style.backgroundColor = 'yellow';
        } else {
            currentRowBoxes[i].style.backgroundColor = 'gray';
        }
        currentRowBoxes[i].innerText = userGuess[i];
    }
}
