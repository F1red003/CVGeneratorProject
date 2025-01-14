document.addEventListener('DOMContentLoaded', async () => {
    try {
        
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:8003/AfficherCV/${userId}`);
        const cvData = await response.json();

      // les infos personnel
        document.querySelector('h1').textContent = 
            `${cvData.heading.Fname} ${cvData.heading.Lname}`;
        document.querySelector('h2').textContent = cvData.heading.JobTitle;
        document.querySelector('.contact-info').textContent = 
            `${cvData.heading.phone} | ${cvData.heading.email} | ${cvData.heading.LinkedIn} | ${cvData.heading.city}, ${cvData.heading.country}`;

        // profile professionnel
        if (cvData.profile) {
            document.querySelector('.section:nth-child(2) p').textContent = 
                cvData.profile.prof;
        }

        // section des reussite
        if (cvData.profile) {
          achDiv.innerHTML = '<h3>Skills</h3>';
          achDiv.innerHTML = `<p>${cvData.profile.achievment}</p>`;
        };

        //experience prof
        const experienceSection = document.querySelector('.section:nth-child(3)');
        experienceSection.innerHTML = '<h3>Expérience Professionnelle</h3>';
        cvData.experience.forEach(exp => {
            experienceSection.innerHTML += 
                `<div class="experience">
                    <h4>${exp.JobTitle} - ${exp.company}</h4>
                    <p class="details">${exp.startDate} - ${exp.endDate} | ${exp.city}</p>
                    <p>${exp.description}</p>
                </div>`
            ;
        });

        // section education
        const eduSection = document.querySelector('.section:nth-child(3)');
        eduSection.innerHTML = '<h3>Education</h3>';
        cvData.education.forEach(edu => {
          eduSection.innerHTML += `
                <div class="experience">
                    <h4>${edu.degree}</h4>
                    <h6> field:${edu.field} at ${edu.school}</h6>
                    <p class="details">${edu.startDate} - ${edu.endDate} | ${edu.city}</p>
                    <p>${edu.description}</p>
                </div>
            `;
        });

        // section des skills
        if (cvData.skills) {
            const skillsDiv = document.querySelector('.skills');
            skillsDiv.innerHTML = '<h3>Skills</h3>';

            cvData.skills.forEach(s => {
              skillsDiv.innerHTML += `
                  <p>${s.skill} (${s.level}))</p>`;
          });       
        }

        // section des courses
        if(cvData.courses){
          const coursesSection = document.querySelector('.section:last-child');
        coursesSection.innerHTML = '<h3>Courses</h3>';
        
        cvData.courses.forEach(course => {
            coursesSection.innerHTML += `
                <p>${course.course} - ${course.Institution} 
                   (${course.StartDate} - ${course.EndDate})</p>
            `;
        });
        }

         // ajout des langues
        if (cvData.languages) {
          const langDiv = document.querySelector('.skills');
          langDiv.innerHTML = '<h3>Languages</h3>';

          cvData.languages.forEach(l => {
            langDiv.innerHTML += `
                <p>${l.Languages} (${l.level}))</p>`;
        });      
        }

        // ajout des interets
        if (cvData.interests) {
          const inteDiv = document.querySelector('.skills');
          inteDiv.innerHTML = '<h3>Interests</h3>';

          cvData.interests.forEach(i => {
            inteDiv.innerHTML += `
                <p>${i.Interests} (${i.Hobbies}))</p>`;
        });      
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error loading DATA');
    }
});

