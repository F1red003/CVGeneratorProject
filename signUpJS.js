const form = document.getElementById('signUpPage');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('password2');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', function(event) {
    if (password.value !== confirmPassword.value) {
        event.preventDefault();
        errorMessage.textContent = 'Passwords do not match!';
        errorMessage.style.color = 'red';
    } else {
        errorMessage.textContent = '';
        window.location.href = 'logInPage.html'; 
    }
});