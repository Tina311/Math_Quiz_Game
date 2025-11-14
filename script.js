let currentQuestion = 1;
let score = 0;
let correctAnswer = 0;

let timer;
let timeLeft = 30;

// Auto start game when page loads
window.onload = () => {
    startGame();
};

function startGame() {
    currentQuestion = 1;
    score = 0;

    document.getElementById("score").textContent = score;
    document.getElementById("current").textContent = currentQuestion;

    updateProgress();
    generateQuestion();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timer").textContent = timeLeft + "s";

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft + "s";

        if (timeLeft <= 0) {
            clearInterval(timer);
            lockOptions();
            moveToNextQuestion();
        }
    }, 1000);
}

function generateQuestion() {
    startTimer();

    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 10) + 2;
    const ops = ["+", "-", "×", "÷"];
    const op = ops[Math.floor(Math.random() * ops.length)];

    switch (op) {
        case "+": correctAnswer = num1 + num2; break;
        case "-": correctAnswer = num1 - num2; break;
        case "×": correctAnswer = num1 * num2; break;
        case "÷":
            correctAnswer = Math.floor(num1 / num2);
            break;
    }

    document.getElementById("question").textContent = `${num1} ${op} ${num2} = ?`;

    // Generate 4 answers
    let answers = [correctAnswer];
    while (answers.length < 4) {
        let fake = correctAnswer + Math.floor(Math.random() * 15) - 7;
        if (!answers.includes(fake) && fake >= 0) answers.push(fake);
    }

    answers.sort(() => Math.random() - 0.5);

    document.getElementById("opt1").textContent = answers[0];
    document.getElementById("opt2").textContent = answers[1];
    document.getElementById("opt3").textContent = answers[2];
    document.getElementById("opt4").textContent = answers[3];

    // Reset button states
    document.querySelectorAll(".option").forEach(btn => {
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
    });
}

function selectAnswer(button) {
    clearInterval(timer);

    const chosen = Number(button.textContent);

    if (chosen === correctAnswer) {
        button.classList.add("correct");
        score++;
        document.getElementById("score").textContent = score;
    } else {
        button.classList.add("wrong");

        document.querySelectorAll(".option").forEach(btn => {
            if (Number(btn.textContent) === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    lockOptions();
    moveToNextQuestion();
}

function lockOptions() {
    document.querySelectorAll(".option").forEach(btn => btn.disabled = true);
}

function moveToNextQuestion() {
    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion <= 10) {
            document.getElementById("current").textContent = currentQuestion;
            updateProgress();
            generateQuestion();
        } else {
            endGame();
        }
    }, 900);
}

function updateProgress() {
    const percent = (currentQuestion / 10) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

function endGame() {
    clearInterval(timer);

    // Show final score
    document.getElementById("question").textContent = `Quiz Finished!`;

    // Replace timer with nothing
    document.getElementById("timer").textContent = "";

    // Hide answer buttons and show score message
    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = true;
        btn.textContent = "-";
    });

    // Create a final result message
    const finalMessage = document.createElement("div");
    finalMessage.style.marginTop = "20px";
    finalMessage.style.textAlign = "center";
    finalMessage.style.fontSize = "20px";
    finalMessage.style.fontWeight = "bold";
    finalMessage.textContent = `Your Score: ${score}/10`;

    document.querySelector(".game-card").appendChild(finalMessage);
}
