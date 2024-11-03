class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.questionContainer = document.getElementById("question-container");
        this.answerButtons = document.getElementById("answer-buttons");
        this.feedback = document.getElementById("feedback");
        this.nextButton = document.getElementById("next-button");
    }

    init() {
        this.nextButton.addEventListener("click", () => this.nextQuestion());

        this.setNextQuestion();
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.setNextQuestion();
        } else {
            this.showQuizEndModal();
            this.currentQuestionIndex = 0;
            this.setNextQuestion();
        }
    }

    setNextQuestion() {
        this.resetState();
        this.showQuestion(this.questions[this.currentQuestionIndex]);
    }

    showQuestion(question) {
        document.getElementById("question").innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");
            button.addEventListener("click", () => this.selectAnswer(answer, question, button));
            this.answerButtons.appendChild(button);
        });
    }

    resetState() {
        this.clearStatusClass(document.body);
        this.nextButton.classList.add("hide");
        while (this.answerButtons.firstChild) {
            this.answerButtons.removeChild(this.answerButtons.firstChild);
        }
        this.feedback.innerText = "";
    }

    selectAnswer(selectedAnswer, question, button) {
        const correct = selectedAnswer.correct;
        if (correct) {
            this.setCorrectFeedback(question.explanation, button);
        } else {
            this.setIncorrectFeedback(button);
        }
    }

    setCorrectFeedback(explanation, button) {
        this.setStatusClass(button, true);
        this.feedback.innerText = explanation;
        this.feedback.className = "text-correct";
        this.nextButton.classList.remove("hide");
    }

    setIncorrectFeedback(button) {
        this.setStatusClass(button, false);
        this.feedback.innerText = "Răspuns incorect. Te rog să încerci din nou.";
        this.feedback.className = "text-wrong";
    }

    setStatusClass(element, correct) {
        this.clearStatusClass(element);
        if (correct) {
            element.classList.add("correct");
        } else {
            element.classList.add("wrong");
        }
    }

    clearStatusClass(element) {
        element.classList.remove("correct");
        element.classList.remove("wrong");
    }

    showQuizEndModal() {
        document.querySelector('.modal-container').classList.remove('hide');
    }
}

async function initQuizz() {
    const fileContent = await fetch('./questions.json');
    const questions = await fileContent.json();
    const quiz = new Quiz(questions);
    document.getElementById('reset-button').addEventListener('click', () => location.reload());
    quiz.init();
}

document.addEventListener('DOMContentLoaded', () => initQuizz());
