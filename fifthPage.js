document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        Interest: document.getElementById('Interest').value,
        Hobbies: document.getElementById('Hobbies').value,
        Languages: document.getElementById('Languages').value,
        level: document.getElementById('level').value,
        course: document.getElementById('course').value,
        Institution: document.getElementById('Institution').value,
        StartDate: document.getElementById('StartDate').value,
        EndDate: document.getElementById('EndDate').value,
        Description: document.getElementById('Desc').value
    };

    try {
        formData.userId = localStorage.getItem("userId");
        const response = await fetch('http://localhost:8003/fifthPage', {
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
            alert(data.error || 'Erreur lors de l\'enregistrement ');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
});