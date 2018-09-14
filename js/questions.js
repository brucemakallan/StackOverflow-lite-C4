/**
 * save the question id for referencing
 */
let setQuestionId = (questionId) => {
    localStorage.setItem("question_id", questionId);
};


/**
 * save the answer id for referencing
 */
let setAnswer = (answerId) => {
    localStorage.setItem("answer_id", answerId);
    fetch(`https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions/${localStorage.getItem("question_id")}/answers`, {
        method: 'GET',
        headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
    })
    .then((response) => response.json())
    .then((data) => {
        data.forEach(element => {
            if(element.id == answerId) {
                localStorage.setItem("answer_details", element.answer);
                window.location.replace('../edit.html');
            }
        });
    })
    .catch((error) => showAlert(error))
}


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
 * get all questions
 */
let getQuestions = () => {
    setUsername();  // set greeting
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
    setUsername();
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
                    let answer_styling = "";
                    let display = "";
                    if(element.accepted) {
                        answer_styling = "green-bg";
                        display = "remove";
                    }
                    answers_output += `
                        <div class="answer-entry ${answer_styling}">
                            <div class="edit"><a href="#" onclick="setAnswer(${element.id});"><img class="icon-small" title="Edit" src="../img/pencil.png" /></a></div>
                            <div class="answer">${element.answer}</div>
                            <div>Accepted: <b>${element.accepted}</b></div>
                            <div class="options margin-t">
                                <a href="#" onclick="setVote(${element.id}, true);"><img class="icon-small margin-r" src="img/thumbs-up.png" alt="Up-vote" title="Up-vote"></a> 
                                <a href="#" onclick="setVote(${element.id}, false);"><img class="icon-small margin-r" src="img/thumbs-down.png" alt="Down-vote" title="Down-vote"></a> 
                                <span class="votes">${element.votes} Votes</span> 
                                <img src="img/clock.png" class="icon-smallest margin-l" /> <i>${element.date_posted}</i>
                                <a href="#" onclick="acceptAnswer(${element.id});" class="circle-link-green ${display}">Accept</a>
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