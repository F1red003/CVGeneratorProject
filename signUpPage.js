document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        FirstName: document.getElementById('Fname').value,
        LastName: document.getElementById('Lname').value,
        email: document.getElementById('email').value,
        userName : document.getElementById('UserName').value,
        password : document.getElementById('password').value
    };

    fetch('http://localhost:8003/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( formData ),
    })
        .then(async response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'User Already exist');
                });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message)
            window.location.href = "logInPage.html";
        })
        .catch(error => {
            console.error('Error fetching user data:', error.message);
            alert(error.message);
        });
});

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
