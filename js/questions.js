/**
 * Show alerts to users
*/
let showAlert = (msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = msg;  // show error message in alert box
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};


/**
 * save the question id for referencing
 */
let setQuestionId = (questionId) => {
    localStorage.setItem("question_id", questionId);
    console.log('qn id = ' + questionId);
};


/**
 * up-vote or down-vote an answer
 */
let setVote = (answerId, bool) => {
    fetch(`https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions/${localStorage.getItem("question_id")}/answers/${answerId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            },
            body: JSON.stringify({vote: bool})
        })
        .then((response) => response.json())
        .then((data) => {
            let jsonStr = JSON.stringify(data);
            if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
                showAlert(data.status_code);
            else if(jsonStr.includes('"id":'))  // sucessful request
                window.location.reload();
        })
        .catch((error) => showAlert(error))
};


/**
 * delete question
 */
let deleteQuestion = (questionId) => {
    fetch(`https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions/${questionId}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        })
        .then((response) => response.json())
        .then((data) => {
            let jsonStr = JSON.stringify(data);
            if(jsonStr.includes("deleted"))
                window.location.replace('../questions.html');
            else
                showAlert(data.status_code);
        })
        .catch((error) => showAlert(error))
};


/**
 * accept answer
 */
let acceptAnswer = (answerId) => {
    fetch(`https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions/${localStorage.getItem("question_id")}/answers/${answerId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            },
            body: JSON.stringify({accepted: true})
        })
        .then((response) => response.json())
        .then((data) => {
            let jsonStr = JSON.stringify(data);
            if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
                showAlert(data.status_code);
            else if(jsonStr.includes('"id":'))  // sucessful request
                window.location.reload();
        })
        .catch((error) => showAlert(error))
}; 


/**
 * get a specific question OR all
 */
let getQuestions = () => {
    fetch("https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions", { 
        method: 'GET',
        headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        })
        .then((response) => response.json())
        .then((data) => {
            jsonStr = JSON.stringify(data);
            if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
                showAlert(data.status_code);
            else if(jsonStr.includes('"id":')) {  // sucessful request
                let output = "";
                data.forEach(element => {
                    output += `
                        <div class="question-entry">
                            <div class="question">
                                &bull; <a href="question.html" onclick="setQuestionId(${element.id});">${element.question}</a>
                            </div>
                            <div class="date"><img src="img/clock.png" class="icon-smallest" /> <i>${element.date_posted.split('.')[0]}</i></div>
                        </div>`;
                });
                document.getElementById('elements').innerHTML = output;
            }
        })
        .catch((error) => showAlert(error))
};


/**
 * Post a new Question
 */
let postQuestion = (e) => {
    e.preventDefault();  // prevent it from saving to a file

    let question = document.getElementById('tx_question').value;

    let inputData = {
        question
    };

    fetch('https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            },
            body: JSON.stringify(inputData)
        })
        .then((response) => response.json())
        .then((data) => {
            let jsonStr = JSON.stringify(data);
            if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
                showAlert(data.status_code);
            else if(jsonStr.includes('"id":')) {  // sucessful request
                showAlert("Your question was posted");
                window.location.replace("../questions.html");
            }
        })
        .catch((error) => showAlert(error))
};


/** 
 * Get a specific quetion with all its answers
 */
let getOneQuestion = (questionId) => {
    fetch(`https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions/${questionId}`, {
        method: 'GET',
        headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
    })
    .then((response) => response.json())
    .then((data) => {
        jsonStr = JSON.stringify(data);
        
        if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
            showAlert(data.status_code);
        else if(jsonStr.includes('"id":')) {  // sucessful request
            let output = `
                <a href="#" onclick="deleteQuestion(${data.question.id});" class="delete" title="Delete">x</a>
                <div class="section-heading">&bull; ${data.question.question}</div>
                <div class="date"><img src="img/clock.png" class="icon-smallest m-left" /> <i>${data.question.date_posted.split('.')[0]}</i></div>`;                
            document.getElementById('question_selected').innerHTML = output;

            // show answers to the question
            if(data.answers != undefined) {
                let answers_output = '';
                data.answers.forEach(element => {
                    answers_output += `
                        <div class="answer-entry">
                            <div class="answer">${element.answer}</div>
                            <div>Accepted: <b>${element.accepted}</b></div>
                            <div class="options margin-t">
                                <a href="#" onclick="setVote(${element.id}, true);"><img class="icon-small margin-r" src="img/thumbs-up.png" alt="Up-vote" title="Up-vote"></a> 
                                <a href="#" onclick="setVote(${element.id}, false);"><img class="icon-small margin-r" src="img/thumbs-down.png" alt="Down-vote" title="Down-vote"></a> 
                                <span class="votes">${element.votes} Votes</span> 
                                <img src="img/clock.png" class="icon-smallest margin-l" /> <i>${element.date_posted}</i>
                                <a href="#" onclick="acceptAnswer(${element.id});" class="circle-link-green">Accept</a>
                            </div>
                        </div>`;
                });
                document.getElementById('answers_list').innerHTML = answers_output;
            } else {
                showAlert('There are no answers for this question');
            }
        }
    })
    .catch((error) => showAlert(error))
};