let showAlert = (error_msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = error_msg;  // show error message in alert box
    console.log(error_msg);
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};


// get a specific question OR all
let getQuestions = (questionId=0) => {
    // TODO change to proper route after testing
    let url = 'https://stackoverflow-lite-abm.herokuapp.com/api/v1/questions';
    if(questionId > 0)
        url += '/' + questionId; 

    fetch(url, {
        method: 'GET',
        headers: {
                'Content-type': 'application/json'
            }
        })
        .then((response) => {
            console.log(response);
            console.log(response.json);
            return response.json;
        })
        .then((data) => console.log(JSON.stringify(data)))
        .catch((error) => showAlert(error))
};

// let postQuestion = () => {
//
// };
