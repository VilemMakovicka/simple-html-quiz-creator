class Question{
    constructor(Title) {
        this.title = Title;
    }
    static getQuestionsFromJson(json){
        return json;
    }
    generateHTML(){
        
    }
    static generateNoQuestionsErrorHTML(){
        let questionContainer = createDiv("", "questionContainer", "", document.body);
        createElement("h3", "Žádné otázky nebyly nalezeny!", "questionTitle", "", questionContainer);
        button = createElement("button", "Refresh", "nextQuestionButton", "", questionContainer);
        button.addEventListener("click", () => { nextQuestion(); });
    }
}

class Question_Options extends Question{
    constructor(Title, FalseOptions, CorrectOptions) {
        super(Title);
        this.falseOptions = FalseOptions;
        this.correctOptions = CorrectOptions;
    }
    generateHTML(){
        questionContainer = createDiv("", "questionContainer", "", document.body);
        createQuestionTitle(question.title, questionContainer);
        createCheckBoxes(questionContainer);
    }
}

class Question_Text extends Question{
    constructor(Title, Answer) {
        super(Title);
        this.answer = Answer;
    }
    generateHTML(){
        let questionContainer = createDiv("", "questionContainer", "", document.body);
        createQuestionTitle(this.title, questionContainer);
        let inputbox = createInputBox("...", "inputbox", questionContainer);
        let question = this;
        inputbox.addEventListener("keydown", function(event) { if (event.key === "Enter") checkTextQuestion(questionContainer, question); }); 
        inputbox.focus();
        endLine(questionContainer);
        createQuestionAnswersButton_Text(questionContainer, this);
        createQuestionCheckButton_Text(questionContainer, this);
        createNextQuestionButton(questionContainer);
    }
}

function createElement(type, innerHtml, _class, _id, parent){
    element = document.createElement(type);
    element.innerHTML += innerHtml;
    element.className = _class;
    element.id = _id;
    parent.appendChild(element);
    return element;
}

function createDiv(content, _class, _id, parent){
    return createElement("div", content, _class, _id, parent);
}

function createH3(content, _class, _id, parent){
    return createElement("h3", content, _class, _id, parent);
}

function createInputBox(placeholder, _id, parent){
    element = createElement("input", "", "questionInputTextBox", _id, parent);
    element.type = "text";
    element.placeholder = placeholder;
    return element;
}

function endLine(parent){
    element = document.createElement("br");
    parent.appendChild(element);
}

function createCheckBoxes(parent){
    element = createElement("button", "", "", parent);
    //element.ariaPressed = "false";

    //<button type="button" id="btn-my-toggle" aria-pressed="false">Click me, a toggle button</button>

    return element;
}

function createQuestionContainer(){
    return createDiv("", "questionContainer", "", document.body);
}

function createQuestionTitle(text, container){
    return createH3(text, "questionTitle", "", container);
}

function createQuestionCheckButton_Text(parent, question){
    element = document.createElement("button");
    element.className = "questionCheckButton";
    element.innerHTML = "Zkontrolovat";

    element.addEventListener("click", () => { checkTextQuestion(parent, question); });

    parent.appendChild(element);
    return element;
}

//vytvořeno pomocí AI
function checkTextQuestion(parent, question){
    // Find the related input box
    const inputBox = parent.querySelector(".questionInputTextBox");
    const userAnswer = inputBox.value.trim().toLowerCase();

    // Check if it matches any of the correct answers
    let correct = false;

    // question.answer can be a string or an array
    if (Array.isArray(question.answer)) {
        correct = question.answer.some(ans => ans.trim().toLowerCase() === userAnswer);
    } else {
        correct = question.answer.trim().toLowerCase() === userAnswer;
    }

    // Create or update result feedback
    let feedback = parent.querySelector(".feedback");
    if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "feedback";
        parent.appendChild(feedback);
    }

    if (correct) {
        feedback.textContent = "Správně!";
        inputBox.style.backgroundColor = "#45ff45";
        feedback.style.color = "#45ff45";
        setTimeout( function() { nextQuestion(); }, 1000);
    } else {
        feedback.textContent = "Špatně. Zkus to znovu.";
        inputBox.style.backgroundColor = "#ff4545";
        feedback.style.color = "#ff4545";
    }
}

function createQuestionAnswersButton_Text(parent, question){
    element = createElement("button", "Odpověď", "questionAnswerButton", "", parent);

    element.addEventListener("click", () => {
        const answer = Array.isArray(question.answer) ? question.answer[0] : question.answer;

        let answerBox = parent.querySelector(".answers");
        if (!answerBox) { 
            answerBox = createElement("div", "Správná odpověď: " + answer, "answers", "", parent);
            answerBox.style.color = "#4545ff";
        }
    });

    return element;
}

function createNextQuestionButton(parent){
    button = createElement("button", "Další otázka", "nextQuestionButton", "", parent);
    button.addEventListener("click", () => { nextQuestion(); });
    return button;
}

function nextQuestion(){
    deleteQuestionContainer();
    main();
}

function deleteQuestionContainer(){
    const container = document.querySelector('.questionContainer');
    container.remove();
}

async function getQuestionsAsJSON(id){
    //let _id = id;
    //jsonText = document.getElementById(_id).textContent;
    //return fetch("questions/" + id + ".json");
    //return JSON.parse(jsonText);

    const response = await fetch("questions/" + id + ".json");
    return await response.json();
}

async function getQuestions(id) {
    const questions = await getQuestionsAsJSON(id);
    const questionArray = [];

    questions.forEach(q => {
        if (q.answers != null) {
            questionArray.push(
                new Question_Text(q.text, q.answers)
            );
        } else if (q.answers_correct || q.answers_false) {
            questionArray.push(
                new Question_Options(
                    q.text,
                    q.answers_false ?? [],
                    q.answers_correct ?? []
                )
            );
        }
    });

    return questionArray;
}


function getFilterButtonState(buttonID){
    return document.getElementById(buttonID).classList.contains("activeFilterButton");
}

questions_InformationSystems = getQuestions("Information_systems");
questions_DatabaseSystems = getQuestions("Database_systems");
questions_AlgorithmsAndProgramming = getQuestions("Algorithms_and_Programming");
questions_ArtificialIntelligence = getQuestions("Artificial_intelligence");
questions_ComputerNetworks = getQuestions("Computer_networks");
questions_Cybersecurity = getQuestions("Cybersecurity");

lastQuestionID = null;
function selectQuestion(){
    let questions = [];

    if(getFilterButtonState("Filter_IS")) questions.push.apply(questions, questions_InformationSystems);
    if(getFilterButtonState("Filter_DS")) questions.push.apply(questions, questions_DatabaseSystems);
    if(getFilterButtonState("Filter_AAP")) questions.push.apply(questions, questions_AlgorithmsAndProgramming);
    if(getFilterButtonState("Filter_AI")) questions.push.apply(questions, questions_ArtificialIntelligence);
    if(getFilterButtonState("Filter_CN")) questions.push.apply(questions, questions_ComputerNetworks);
    if(getFilterButtonState("Filter_CS")) questions.push.apply(questions, questions_Cybersecurity);

    if(questions.length < 1) return null;
    if(questions.length == 1) return questions[0];

    selectedQuestion = null;
    selectedQuestionID = lastQuestionID
    while(selectedQuestionID == lastQuestionID){
        selectedQuestionID = Math.floor(Math.random() * questions.length);
    }
    lastQuestionID = selectedQuestionID;
    return questions[selectedQuestionID];
}

function createFilterButton(innerHtml, id, parent){
    button = createElement("button", innerHtml, "filterButton", id, parent);
    button.classList.toggle("activeFilterButton");
    button.addEventListener("click", () => { 
        document.getElementById(id).classList.toggle("activeFilterButton");
    });
}
/*
*
* MAIN
*
*/

async function start(){
    filterContainer = createElement("div", "", "filterContainer", "", document.body);
    createElement("a", "Show questions from:", "filterHeader", "", filterContainer);
    endLine(filterContainer);

    questions_InformationSystems = await getQuestions("Information_systems");
    questions_DatabaseSystems = await getQuestions("Database_systems");
    questions_AlgorithmsAndProgramming = await getQuestions("Algorithms_and_Programming");
    questions_ArtificialIntelligence = await getQuestions("Artificial_intelligence");
    questions_ComputerNetworks = await getQuestions("Computer_networks");
    questions_Cybersecurity = await getQuestions("Cybersecurity");
    

    createFilterButton("Algorithms and programming (" + questions_AlgorithmsAndProgramming.length + ")", "Filter_AAP", filterContainer);
    createFilterButton("Database systems (" + questions_DatabaseSystems.length + ")", "Filter_DS", filterContainer);
    createFilterButton("Information systems (" + questions_InformationSystems.length + ")", "Filter_IS", filterContainer);
    createFilterButton("Artificial Intelligence (" + questions_ArtificialIntelligence.length + ")", "Filter_AI", filterContainer);
    createFilterButton("Computer networks (" + questions_ComputerNetworks.length + ")", "Filter_CN", filterContainer);
    createFilterButton("Cybersecurity (" + questions_Cybersecurity.length + ")", "Filter_CS", filterContainer);
}

function main(){
    question = selectQuestion();
    if(question) question.generateHTML();
    else Question.generateNoQuestionsErrorHTML();

}

async function init(){
    await start();
    main();
}

init();