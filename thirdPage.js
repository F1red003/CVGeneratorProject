document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        prof : document.getElementById('prof').value,
        achievment : document.getElementById('achievment').value,
        skill : document.getElementById('skill').value,
        level:document.getElementById('level').value
    };

    try {
        formData.userId = localStorage.getItem("userId");
        const response = await fetch('http://localhost:8003/thirdPage', {
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