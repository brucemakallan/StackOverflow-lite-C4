// Post an Answer
let postAnswer = (e) => {
    e.preventDefault();  // prevent it from saving to a file
    let answer = document.getElementById('tx_answer').value;
    let inputData = {
        answer
    };

    fetch(`https://stackoverflow-lite3-abm.herokuapp.com/api/v1/questions/${localStorage.getItem("question_id")}/answers`, {
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
            else if(jsonStr.includes('"id":'))  // sucessful request
                window.location.reload();
        })
        .catch((error) => showAlert(error))
};



