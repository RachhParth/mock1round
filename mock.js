"use strict";


const MIN_NUMBER = 1;
const MAX_NUMBER = 100;



let targetNumber;
let userGuesses = [];
let attempts = 0;
let gameOver = false;


const guessInput = document.getElementById("guessInput");
const submitButton = document.getElementById("submitButton");

const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attemptsDisplay");
const previousGuesses = document.getElementById("previousGuesses");

const gameArea = document.getElementById("gameArea");
const gameOverArea = document.getElementById("gameOverArea");

const finalMessage = document.getElementById("finalMessage");
const resetButton = document.getElementById("resetButton");

const bestScoreDisplay = document.getElementById("bestScore");



function generateRandomNumber() {
    return Math.floor(
        Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)
    ) + MIN_NUMBER;
}

function startGame() {

    targetNumber = generateRandomNumber();

    userGuesses = [];
    attempts = 0;
    gameOver = false;


    attemptsDisplay.textContent = attempts;

    previousGuesses.innerHTML = "";

    feedback.textContent = "Make your first guess!";
    feedback.className = "feedback";

    guessInput.value = "";

    guessInput.disabled = false;
    submitButton.disabled = false;

    gameArea.classList.remove("hidden");
    gameOverArea.classList.add("hidden");

    guessInput.focus();

    loadBestScore();
}


function validateGuess(value) {

    if (value.trim() === "") {
        return {
            valid: false,
            message: "⚠️ Please enter a number."
        };
    }

    const number = Number(value);


    if (!Number.isFinite(number)) {
        return {
            valid: false,
            message: "⚠️ Please enter a valid number."
        };
    }

    if (!Number.isInteger(number)) {
        return {
            valid: false,
            message: "⚠️ Please enter a whole number."
        };
    }


    if (number < MIN_NUMBER || number > MAX_NUMBER) {
        return {
            valid: false,
            message: `⚠️ Enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}.`
        };
    }

    return {
        valid: true,
        number: number
    };
}


function makeGuess() {

    if (gameOver) {
        return;
    }

    const validation = validateGuess(guessInput.value);

    
    if (!validation.valid) {

        feedback.textContent = validation.message;
        feedback.className = "feedback";

        guessInput.focus();

        return;
    }

    const guess = validation.number;

   
    if (userGuesses.includes(guess)) {

        feedback.textContent =
            `⚠️ You already guessed ${guess}. Try another number.`;

        feedback.className = "feedback";

        guessInput.select();

        return;
    }

    
    userGuesses.push(guess);

    attempts++;

    
    attemptsDisplay.textContent = attempts;

    
    addPreviousGuess(guess);


    guessInput.value = "";

    if (guess === targetNumber) {

        handleCorrectGuess();

    } else if (guess < targetNumber) {

        feedback.textContent = "📈 Too low! Try a higher number.";
        feedback.className = "feedback low";

    } else {

        feedback.textContent = "📉 Too high! Try a lower number.";
        feedback.className = "feedback high";
    }

    guessInput.focus();
}

function addPreviousGuess(guess) {

    const listItem = document.createElement("li");

    listItem.textContent = guess;

    previousGuesses.appendChild(listItem);
}

function handleCorrectGuess() {

    gameOver = true;

    feedback.textContent = "🎉 Correct! You guessed the number!";
    feedback.className = "feedback correct";

    guessInput.disabled = true;
    submitButton.disabled = true;

    // Save best score
    saveBestScore();

    finalMessage.textContent =
        `You found the number ${targetNumber} in ${attempts} attempt${attempts === 1 ? "" : "s"}!`;

    // Small delay before showing game over screen
    setTimeout(() => {

        gameArea.classList.add("hidden");
        gameOverArea.classList.remove("hidden");

    }, 700);
}

function saveBestScore() {

    const savedScore = localStorage.getItem("numberGameBestScore");

    if (
        savedScore === null ||
        attempts < Number(savedScore)
    ) {
        localStorage.setItem(
            "numberGameBestScore",
            attempts
        );
    }
}

function loadBestScore() {

    const savedScore =
        localStorage.getItem("numberGameBestScore");

    if (savedScore !== null) {
        bestScoreDisplay.textContent = savedScore;
    } else {
        bestScoreDisplay.textContent = "-";
    }
}

submitButton.addEventListener("click", makeGuess);

resetButton.addEventListener("click", startGame);

// Allow Enter key to submit
guessInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        makeGuess();
    }

});

startGame();
