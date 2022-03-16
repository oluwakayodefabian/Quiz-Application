// Grab elements from the DOM
const question              = document.getElementById("question");
const choices               = document.querySelectorAll(".choice-text");
const questionCounterText   = document.getElementById("questionCounter");
const scoreText             = document.getElementById("score");
const progressBar           = document.getElementById("progressBar");
const hideBox               = document.getElementById("hideBox");
const questionsContainer    = document.getElementById("questions-container");
const startPlaying          = document.getElementById("startPlaying");
const timer                 = document.getElementById("timer");
const timerContainer        = document.getElementById("timerContainer");
// const loader                = document.getElementById("loader");

let currentQuestion     = {};
let acceptingAnswers    = false;
let score = 0;
let questionCounter     = 0;
let availableQuestions  = [];
let quizHasStarted = false;
let fixedTimeInSeconds  = 60 * 0.5;
let minutes             = parseInt(fixedTimeInSeconds / 60);
let seconds             = parseInt(fixedTimeInSeconds % 60);

let questions = [];

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 4;

// fetch api to get questions.json
fetch("questions.json")
.then((res) => res.json())
.then((loadedQuestions) => {
    questions = loadedQuestions;
    // invoke startGame()
    startGame();
})
.catch((err) => {
    console.log(`Error: ${err}`);
});



/**
 * To be visited later 
 * set 10 minutes for the entire quiz, if the time elapses
 * end the quiz and redirect the user to the end page
 */
function startTimer() {
   timer.innerText = `${minutes} : ${seconds}`;
   if (fixedTimeInSeconds <= 0) {
       alert("Your time is up");
       window.location.assign("./end.html")
   } else {
       fixedTimeInSeconds -= 1;
       console.log(fixedTimeInSeconds);
       minutes = parseInt(fixedTimeInSeconds / 60);seconds = parseInt(fixedTimeInSeconds % 60);
       if (quizHasStarted){
            setTimeout(startTimer, 1000);
       }
   }
}

// remove the popUpbox when startPayingBtn is clicked
startPlaying.addEventListener("click", (e) => {
   hideBox.classList.add("hide");
    questionsContainer.style.pointerEvents = "all";
    timerContainer.style.display = "flex";
    quizHasStarted = true
    startTimer();
});

const startGame = () => {
    if (!hideBox.classList.contains("hide")) 
    {
        questionsContainer.style.pointerEvents = "none";
        timerContainer.style.display = "none";
    } 

    // just making sure questionCounter and score is starting at 0
    questionCounter = 0;
    score = 0;

    // use the spread operator(...) on the questions array to spread out each of its item and put them into a new array
    availableQuestions = [...questions]

    // Invoke getNewQuestions()
    getNewQuestion();
}

 const getNewQuestion = () =>{
     if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) 
     {
         // save player's score in localStorage
         localStorage.setItem("MostRecentScore", score);
         // go to the end page
         return window.location.assign("/end.html");
     }
     
    // increment questionCounter
    questionCounter++
    // Output current question number
    questionCounterText.innerText = `${questionCounter} / ${MAX_QUESTIONS}`;

    // Update the progress bar
    progressBar.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";

    // Get random questions
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);

    // get reference to the current question by getting it out of availableQuestions array
    currentQuestion = availableQuestions[questionIndex];
   
    // spit out a question on the questions page
    question.innerText = currentQuestion.question;
    
    choices.forEach((choice) => {
        // get number property from the dataset property
        const number = choice.dataset["number"];
        // spit out choice1, choice2, choice3, choice4 on the question page
        choice.innerText = currentQuestion["choice" + number];
    });  

    // take the availableQuestions array and splice out the questions just used and show a new one
    availableQuestions.splice(questionIndex, 1);

    // After loading the questions we can now start accepting answers
    acceptingAnswers = true;
}

// Iterate over each choice and add a click event to each choice
choices.forEach(choice => {
    choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = parseInt(selectedChoice.dataset["number"]);
        const classToApply = selectedAnswer === currentQuestion.answer ? "correct" : "incorrect";
        
        // check if classToApply is equal to correct, call the incrementScore(param) function
        if (classToApply === "correct") 
        {
            incrementScore(CORRECT_BONUS);
        }
        // apply class to the parent of the selected choice
        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout(() =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000)
    })
})

const incrementScore = num => {
    score += num;
    scoreText.innerText = score
}