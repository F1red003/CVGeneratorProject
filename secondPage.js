document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        school : document.getElementById('school').value,
        city : document.getElementById('city').value,
        degree : document.getElementById('degree').value,
        field : document.getElementById('field').value,
        startDate : document.getElementById('startDate').value,
        endDate : document.getElementById('endDate').value,
        description : document.getElementById('Desc').value
    };

    try {
        formData.userId = localStorage.getItem("userId");
        const response = await fetch('http://localhost:8003/secondPage', {
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