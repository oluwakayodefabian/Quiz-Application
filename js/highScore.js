const highScore = document.getElementById("highScoreList");

const getHighscores = JSON.parse(localStorage.getItem("HighScore"));

let showHighScore = getHighscores.map((score) => {
     let tableRow = `
     <tr> 
        <td>${score.name}</td>
        <td>${score.score}</td>
    </tr>`
    return tableRow;
}).join("")
highScore.innerHTML = showHighScore;
