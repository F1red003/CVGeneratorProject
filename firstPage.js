document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        FirstName: document.getElementById('Fname').value,
        LastName: document.getElementById('Lname').value,
        image:document.getElementById('image').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        adress: document.getElementById('adress').value,
        city: document.getElementById('city').value,
        dateOfBirth:document.getElementById('dateOfBirth').value,
        country: document.getElementById('country').value,
        nationality: document.getElementById('nationality').value,
        LinkedIn: document.getElementById('LinkedIn').value,
        JobTitle: document.getElementById('JobT').value
    };

    try {
        console.log(localStorage.getItem("userId"));
        formData.userId = localStorage.getItem("userId");
        const response = await fetch('http://localhost:8003/firstPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Utilisateur enregistré avec succès!');
            document.getElementById('userForm').reset();
        } else {
            alert(data.error || 'Erreur lors de l\'enregistrement 1');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
});