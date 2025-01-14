document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        JobTitle: document.getElementById('JobTitle').value,
        city: document.getElementById('city').value,
        company: document.getElementById('company').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        description: document.getElementById('description').value
    };

    try {
        formData.userId = localStorage.getItem("userId");
        const response = await fetch('http://localhost:8003/fourthPage', {
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
            alert(data.error || 'Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
});