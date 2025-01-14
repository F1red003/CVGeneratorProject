
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:8003/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName : document.getElementById('Uname').value,
                password :  document.getElementById('password').value
               })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Login successful!');
            document.getElementById('userForm').reset();
            console.log(data.userId);
            localStorage.setItem("userId", data.userId);
            window.location.href = "firstPage.html";
        } else {
            alert(data.error || 'Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
});
