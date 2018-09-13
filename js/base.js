/**
 * Show alerts to users
*/
let showAlert = (msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = msg;  // show error message in alert box
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};