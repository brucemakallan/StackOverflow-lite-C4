let showAlert = (error_msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = error_msg;  // show error message in alert box
    console.log(error_msg);
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};


let signUp = (e) => {
    e.preventDefault();  // prevent it from saving to a file

    let username = document.getElementById('username').value;
    let full_name = document.getElementById('full_name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let retype_password = document.getElementById('retype_password').value;

    let inputData = {
        username,
        full_name,
        email,
        password,
        retype_password
    };

    fetch('https://stackoverflow-lite3-abm.herokuapp.com/api/v1/auth/signup', {
            method: 'POST',
            mode: "no-cors",  // no cross origin requests. Only HEAD, GET, and POST accepted
            headers: {
                'Content-type': 'application/json'
            },
            body: inputData
        })
        .then((response) => response.json())
        .then((data) => console.log(JSON.stringify(data)))
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
        .then((data) => console.log(JSON.stringify(data)))
        .catch((error) => showAlert(error))
}