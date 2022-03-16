const saveScoreBtn = document.getElementById
("saveScoreBtn");
const username   = document.getElementById("username");
const finalScore = document.getElementById("final-score");
const getScore   = localStorage.getItem("MostRecentScore");
finalScore.innerText = `Your total score: ${getScore}`;

// get HighScore from localStorage
const highScore = JSON.parse(localStorage.getItem("HighScore"))|| [];
console.log(highScore);

username.addEventListener("keyup", (e) => {
    let enableBtn = saveScoreBtn.disabled = !username.value;
})
saveScoreBtn.addEventListener("click", e => {
    e.preventDefault();
    
    const score = {
        score: Math.floor(Math.random() * getScore),
        name: username.value
    };
    // to revisited
    highScore.push(score);
    highScore.sort((a,b) => b.score - a.score);
    highScore.splice(5)
    localStorage.setItem("HighScore", JSON.stringify(highScore));
    window.location.assign("index.html")
})
