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
document.addEventListener('DOMContentLoaded', resetGame);


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

async function fetchNewWord() {
    const url = 'https://random-word-api.herokuapp.com/word?length=5';

    try {
        const response = await fetch(url);
        const words = await response.json()
        const answer = words[0]
        console.log('Words fetched:', answer)

        const response1 = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + answer)

        if (words.length > 0 && typeof words[0] === 'string') {
            return answer.toUpperCase()
        }
        // else {
        //     throw new Error('No words found.')
        // }
    } catch (error) {
        console.error('Failed to fetch new word:', error)
        return fetchNewWord()
    }
}

async function submitGuess() {
    if (userGuess.length !== 5) {
        h2.textContent = "Please enter a 5-letter word.";
        return;
    }

    const guessedWord = userGuess.join('').toLowerCase();
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Word not found in the dictionary');
        }
        const data = await response.json();
        if (data.length > 0 && data[0].word) {
            console.log("Valid word!");
            continueGameLogic(guessedWord);
        } else {
            h2.textContent = "The word doesn't exist. Try another.";
        }
    } catch (error) {
        console.log('Error validating word:', error.message);
        h2.textContent = "The word doesn't exist. Try another.";
    }
}

function continueGameLogic(guessedWord) {
    letterCheck(secretWord, [...userGuess]);
    pastGuesses.push([...userGuess]);
    userGuess = [];

    if (pastGuesses[pastGuesses.length - 1].join('') === secretWord) {
        h2.textContent = "Congratulations! You've guessed the word correctly!";
        document.removeEventListener('keydown', onKeyHandle);
    }
    updateBoxes();

    if (++currentRowIndex >= rows.length) {
        h2.textContent = `Game over! The word was: ${secretWord}`;
    } else {
        updateBoxes();
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

async function resetGame() {
    const newWord = await fetchNewWord()
    if (newWord) {
        secretWord = newWord
    } else {
        console.error('Failed to load a new word. Using a default word.')
        secretWord = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();
    }

    userGuess = []
    pastGuesses = []
    currentRowIndex = 0

    rows.forEach(row => {
        const boxes = row.querySelectorAll('.box')
        boxes.forEach(box => {
            box.innerText = ''
            box.style.backgroundColor = ''

        })
    })
    h2.innerText = ''
    document.addEventListener('keydown', onKeyHandle)
    console.log(secretWord)
}

button.addEventListener('click', resetGame)

console.log(secretWord)
console.log("Updating boxes with:", userGuess);
console.log("Current row index:", currentRowIndex);

//last box doesn't reflect text of userGuess. needs work.  