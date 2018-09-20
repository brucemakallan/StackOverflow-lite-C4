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
 * Set greeting with first name
 */
let setUsername = () => {
    if(localStorage.getItem('full_name') === null) {
        document.getElementById('greeting').innerHTML = "";
        document.getElementById('logout').style.display = "none";
        // not logged in therefore, go home to login
        if(!window.location.pathname.includes("index.html"))
            window.location.replace('index.html');
    } else {
        document.getElementById('greeting').innerHTML = "Hello, " + localStorage.getItem('full_name').split(" ")[0];        
    }
}


// Logout
let logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("full_name");
    window.location.replace('index.html');
}