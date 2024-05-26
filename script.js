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

function celebrateWin() {
    confetti({
        particleCount: 100,
        spread: 70,
        angle: 60,
        origin: { y: 1, x: 0 }
    });

    confetti({
        particleCount: 100,
        spread: 70,
        angle: 120,
        origin: { y: 1, x: 1 }
    });
}

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
        const words = await response.json();
        if (words.length > 0 && typeof words[0] === 'string') {
            const answer = words[0];
            console.log('Word fetched:', answer);

            const validationUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + answer;
            const validationResponse = await fetch(validationUrl);
            if (!validationResponse.ok) {
                throw new Error('Word not valid or not found in dictionary');
            }
            const validationData = await validationResponse.json();
            if (validationData.length > 0 && validationData[0].word) {
                console.log('Valid word:', answer);
                return answer.toUpperCase();
            } else {
                throw new Error('Invalid word fetched, trying again.');
            }
        }
    } catch (error) {
        console.error('Failed to fetch/validate new word:', error);
        return fetchNewWord();
    }
}

//compare user guess against dictionary
async function submitGuess() {
    if (userGuess.length !== 5) {
        showMessage("Please enter a 5-letter word.");
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
            showMessage("Not in word list.");
        }
    } catch (error) {
        console.log('Error validating word:', error.message);
        showMessage("Not a valid word. Try another.");
    }
}
function showMessage(message, persist = false) {
    const h2 = document.getElementById('message');
    h2.textContent = message;
    h2.classList.add('show');
    if (!persist) {
        setTimeout(() => {
            h2.classList.remove('show');
        }, 3000);
    }
}

function continueGameLogic(guessedWord) {
    letterCheck(secretWord, [...userGuess]);
    pastGuesses.push([...userGuess]);

    updateBoxes();

    if (pastGuesses[pastGuesses.length - 1].join('') === secretWord) {
        showMessage("Congratulations! You've guessed the word correctly!", true);
        document.removeEventListener('keydown', onKeyHandle);
        celebrateWin()
        // document.addEventListener('keyup', function (event) {
        //     if (event.key === "Enter") {
        //         celebrateWin(); // Allow multiple triggers on pressing Enter
        //     }
        // })

        
        // setTimeout(() => {

        //     userGuess = [];
        //     if (++currentRowIndex >= rows.length) {
        //         showMessage(`Game over! The word was: ${secretWord}`, true);
        //     } else {
        //         updateBoxes();
        //     }
        // }, 3000);
    } else {
        userGuess = [];
        if (++currentRowIndex >= rows.length) {
            showMessage(`Game over! The word was: ${secretWord}`, true);
        } else {
            updateBoxes();
        }
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
    animateBoxes(currentRowBoxes);
}

function animateBoxes(boxes) {
    boxes.forEach(box => {
        box.classList.add('pulse');

        // Remove the animation class after it ends to reset the animation
        box.addEventListener('animationend', () => {
            box.classList.remove('pulse');
        });
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
    console.log(`The new secret word is: ${secretWord}`)
    document.activeElement.blur();
}

button.addEventListener('click', resetGame)


