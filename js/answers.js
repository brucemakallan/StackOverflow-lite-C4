let showAlert = (error_msg) => {
    let alertDiv = document.getElementById('alert-msg');
    alertDiv.style.display = "block";
    alertDiv.innerHTML = error_msg;  // show error message in alert box
    console.log(error_msg);
    setTimeout(() => alertDiv.style.display = "none", 7000);  // remove alert message after a while
};

