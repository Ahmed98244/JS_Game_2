// select elements
let countSpan = document.querySelector(".count span");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countDownBox = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// get question from ajax
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;

      // create bullets + set question count
      createBullets(questionCount);

      // add question data
      addQuestionData(questionObject[currentIndex], questionCount);

      // start countDown
      countDown(5, questionCount);

      // click on submit
      submitButton.onclick = () => {
        // get Right answer
        let theRightAnswer = questionObject[currentIndex].right_answer;

        // increase index
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, questionCount);

        // remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add question data
        addQuestionData(questionObject[currentIndex], questionCount);

        // handle bullets classes
        handleBullets();

        // start countDown
        clearInterval(countDownInterval);
        countDown(5, questionCount);

        // show results
        showResult(questionCount);
      };
    }
  };

  myRequest.open("GET", "Html_questoins.json", true);
  myRequest.send();
}
getQuestions();

// create bullet function
function createBullets(num) {
  countSpan.innerHTML = num;

  // create spans
  for (let i = 0; i < num; i++) {
    // create span
    let theBullet = document.createElement("span");

    // check if it first span
    if (i === 0) {
      theBullet.className = "on";
    }

    // append bullets to main bullet container
    bulletSpanContainer.appendChild(theBullet);
  }
}
// add questinon function
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2
    let questionTitle = document.createElement("h2");

    // call title of question
    let questionText = document.createTextNode(obj["title"]);

    // append text to h2
    questionTitle.appendChild(questionText);

    // append h2 to quiz area
    quizArea.appendChild(questionTitle);

    // create the answers
    for (let i = 1; i < 5; i++) {
      // create main div
      let mainDiv = document.createElement("div");

      // add class to main div
      mainDiv.className = "answer";

      // create input
      let radioInput = document.createElement("input");

      // add type + name + id + data Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // make first answer checked
      if (i === 1) {
        radioInput.checked = true;
      }

      // create label
      let theLabel = document.createElement("label");

      // add for attribute
      theLabel.htmlFor = `answer_${i}`;

      // create text label
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // add the text to label
      theLabel.appendChild(theLabelText);

      // add the input + label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // add to quiz area
      answersArea.appendChild(mainDiv);
    }
  }
}
// check function
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}
// handle bullets function
function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSoans = Array.from(bulletsSpan);

  arrayOfSoans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
// show result function
function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="Good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Well Done</span>`;
    } else {
      theResult = `<span class="bad">bad</span>, ${rightAnswers} From ${count}`;
    }

    results.innerHTML = theResult;
    results.style.padding = "10px";
    results.style.backgroundColor = "white";
    results.style.marginTop = "10px";
  }
}
// count down function
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownBox.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
