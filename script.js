const possibleWords = ['blink', 'point', 'indie']
let secretWord = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();
let userGuess = [];
let pastGuesses = [];
const boxes = document.querySelectorAll('.box');
let rows = document.querySelectorAll('.row')
let currentRowIndex = 0;
const currentRowBoxes = rows[currentRowIndex].querySelectorAll('.box')
const availableLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const h2 = document.querySelector('h2')
const button = document.querySelector('button')

function onKeyHandle(event) {
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
};

document.addEventListener('keydown', onKeyHandle)

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
        letterCheck(secretWord, [...userGuess]);
        pastGuesses.push([...userGuess]);
        userGuess = [];

        if (pastGuesses[pastGuesses.length - 1].join('') === secretWord) {
            h2.innerText = "Congratulations! You've guessed the word correctly!"
            document.removeEventListener('keydown', onKeyHandle)
        }
        updateBoxes();

        if (++currentRowIndex >= rows.length) {
            h2.innerText = `Game over! The word was: ${secretWord}`;
        } else {
            updateBoxes();
        }
    } else {
        h2.innerText = "Please enter 5 letters."
    }
}


//GAME LOGIC//
function letterCheck(secretWord, userGuess) {
    const letterCounts = {};
    const processed = new Array(secretWord.length).fill(false);
    const currentRowBoxes = rows[currentRowIndex].querySelectorAll('.box');

    for (const letter of secretWord) {
        if (letterCounts[letter]) {
            letterCounts[letter]++;
        } else {
            letterCounts[letter] = 1;
        }
    }

    userGuess.forEach((guess, i) => {
        if (guess === secretWord[i]) {
            currentRowBoxes[i].style.backgroundColor = '#538d4e';  // green
            letterCounts[guess]--;
            processed[i] = true;
        }
    });

    userGuess.forEach((guess, i) => {
        if (!processed[i]) {
            if (letterCounts[guess] > 0) {
                currentRowBoxes[i].style.backgroundColor = '#b59f3b';  // yellow
                letterCounts[guess]--;
            } else {
                currentRowBoxes[i].style.backgroundColor = '#3a3a3c';  // gray
            }
            currentRowBoxes[i].innerText = guess;
        }
    });
}

function resetGame() {
    userGuess = []
    pastGuesses = []
    currentRowIndex = 0
    secretWord = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();

    rows.forEach(row => {
        const boxes = row.querySelectorAll('.box')
        boxes.forEach(box => {
            box.innerText = ''
            box.style.backgroundColor = ''

        })
    })
    h2.innerText = ''
    document.addEventListener('keydown', onKeyHandle)
}

button.addEventListener('click', resetGame)

console.log(secretWord)