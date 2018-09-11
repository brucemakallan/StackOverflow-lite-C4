let showAlert = (msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = msg;  // show error message in alert box
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};


// get a specific question OR all
let getQuestions = (questionId=0) => {
    let url = "https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions";
    if(questionId > 0)
        url += '/' + questionId; 

    fetch(url, { 
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
                console.log(jsonStr);
            }
        })
        .catch((error) => showAlert(error))
};


// Post a new Question
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
            // console.log(jsonStr);
            if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
                showAlert(data.status_code);
            else if(jsonStr.includes('"id":')) {  // sucessful request
                showAlert("Your question was posted");
            }
        })
        .catch((error) => showAlert(error))
};
