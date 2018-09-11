let showAlert = (msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = msg;  // show error message in alert box
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};


let signUp = (e) => {
    e.preventDefault();  // prevent it from saving to a file

    let full_name = document.getElementById('full_name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let retype_password = document.getElementById('retype_password').value;

    let inputData = {
        full_name,
        email,
        password,
        retype_password
    };

    fetch('https://stackoverflow-lite3-abm.herokuapp.com/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(inputData)
        })
        .then((response) => response.json())
        .then((data) => {
            let jsonStr = JSON.stringify(data);
            // console.log(jsonStr);
            if(jsonStr.includes("status_code"))  // response with "status_code" = something went wrong
                showAlert(data.status_code);  // show message to user
            else if(jsonStr.includes("access_token"))  {// sucessful login
                // Using HTML5 web storage
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("user_id", data.id);
                    // console.log(localStorage.getItem("access_token"));
                    // console.log(localStorage.getItem("user_id"));
                    window.location.replace("../index.html");
                } else 
                    showAlert("No Support for Web Storage");
            }
        })
        .catch((error) => showAlert(error))
};


let login = (e) => {
    e.preventDefault();  // prevent it from saving to a file

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let inputData = {
        email,
        password
    };

    fetch('stackoverflow-lite3-abm.herokuapp.com/api/v1/auth/login', {
            method: 'POST',
            mode: 'no-cors',  // no cross origin requests. Only HEAD, GET, and POST accepted
            headers: {
                'Content-type': 'application/json'
            },
            body: inputData
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log(JSON.stringify(data))
        })
        .catch((error) => showAlert(error))
}