//https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quizz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestions = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');


let correctAnswer= "";
let correctScore = 0;
let askedCount = 0;
let totalQuestion = 10;


document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _totalQuestions.textContent = totalQuestion;
    correctScore.textContent = correctScore;
});

function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuizz);
}

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    _result.innerHTML = "";
    //console.log(data.results[0]);
    showQuestion(data.results[0])
};


function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    console.log(correctAnswer);
    console.log(incorrectAnswer);
    console.log(optionsList);

    question.innerHTML = `${data.question} <br> <span class="category"> ${data.category}</span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) =>`
            <li>${index + 1}. <span>${option}</span></li>
            `).join('')}
            ` ;
    selectOption();
};

function selectOption(){
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected') ;
            }
            option.classList.add('selected');
        })
    })
};

function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected').textContent;
        console.log(selectedAnswer);
        if(selectedAnswer.slice(3) == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p>Correct answer!</p>`
        }else {
            _result.innerHTML = `<p>Incorrect answer!<b></p><p>Correct answer:</b> ${correctAnswer}</p>`
        }
        checkCount();
    } else {
        _result.innerHTML = `<p>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
};

function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML = `<p>Your secore is ${correctScore}</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = none;
    } else{
        setTimeout(() => {
            loadQuestion();
        }, 300);
    };
};

function setCount(){
    _totalQuestions.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
};

function restartQuizz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}