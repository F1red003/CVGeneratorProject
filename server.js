const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const path = require('path');
const bcrypt = require('bcrypt');
const UserID=1;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(__dirname));

dotenv.config({path : './sensitiveData.env'})

const PORT = 8003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

var con = mysql.createConnection({
    host: process.env.Host,
    user: process.env.MySQLUser,
    password: process.env.MySQLPassword,
    database: process.env.DatabaseName
});
con.connect(error => {
    if (error) {
        console.error('Erreur de connexion à la base de données:', error);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePage.html'));
});

//partie authentication
app.post("/signup", async (req, res) => {
    const {FirstName, LastName, email,userName, password } = req.body;
    if (!userName || !password) {
        return res.status(400).json({ error: 'Missing userName or password' });
    }
    const queries={
        Uname : 'SELECT * FROM users WHERE userName = ?'
    }

    new Promise((resolve, reject) => {
        con.query(queries.Uname, [userName], (error, results) => {
            if (error) return reject(error); 
            resolve(results); 
        });
    })
    .then(async (results) => {
        if (results.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (FirstName, LastName, email, userName, password) VALUES (?, ?, ?, ?, ?)`;
        con.query(query, [FirstName, LastName, email, userName, hashedPassword], (error, result) => {
            if (error) {
                console.error('Error during insertion:', error);
                return res.status(500).json({ error: 'Error' });
            }
            res.json({ message: 'Successfully inserted' });
        });
    })
    .catch((error) => {
        console.error('Error during signup process:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
             
});

app.post("/login", (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return res.status(400).json({ error: 'Missing userName or password' });
    }
    new Promise((resolve, reject) => {
        con.execute('SELECT * FROM users WHERE userName = ?', [userName], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    })
        .then((rows) => {
            if (rows.length === 0) {
                throw { status: 401, error: 'Invalid credentials' };
            }
            const user = rows[0];
            return bcrypt.compare(password, user.password).then((isMatch) => {
                if (!isMatch) {
                    throw { status: 401, error: 'Invalid credentials' };
                }
                console.log(user.UserID,user)
                return user.UserID;
            });
        })
        .then((userId) => {
            console.log(`the user id is :`, userId)
            res.status(200).json({
                message: 'Login successful',
                userId,
            });
        })
        .catch((err) => {
            // Handle errors
            if (err.status) {
                // Custom error with status code
                return res.status(err.status).json({ error: err.error });
            }

            console.error('Error during login:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// Route API pour inserer dans la table heading
app.post('/firstPage', function(req, res) {
    
    const { 
        FirstName, LastName, email, phone, adress, 
        city, dateOfBirth, country, nationality, LinkedIn, JobTitle 
    } = req.body;

    const query = `INSERT INTO heading (FirstName, LastName, email, phone, adress,city, dateOfBirth, country, nationality,LinkedIn, JobTitle ,userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    con.query(
        query, 
        [FirstName, LastName, email, phone, adress, city, dateOfBirth, country, nationality, LinkedIn, JobTitle,UserID ],
        function(error, result) {
            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement 2' });
                return;
            }
            res.status(201).json({ 
                message: 'Utilisateur créé avec succès', 
                id: result.insertId
                 
            });
        }
    );   
});

// Route API pour inserer dans la table education
app.post('/secondPage', function(req, res) {
    const { 
        school, city, degree, field, startDate, endDate, description
    } = req.body;

    console.log('Données reçues:', req.body);

    const query = `INSERT INTO education (school, city, degree, field, startDate, endDate, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    con.query(
        query, 
        [school, city, degree, field, startDate, endDate, description, UserID],
        function(error, result) {
            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
                return;
            }
            res.status(201).json({ 
                message: 'Utilisateur créé avec succès', 
                id: result.insertId 
            });
        }
    );
});

// Route API pour inserer dans la table profile et skills
app.post('/thirdPage', function(req, res) { 
    const { prof, achievement, skill, level} = req.body;
    const queryProfile = `INSERT INTO profile (prof, achievements, userId) VALUES (?, ?,?)`;
    con.query(queryProfile, [prof, achievement, UserID],function(error, result) {
            if (error) {
                console.error('Error during insertion:', error);
                res.status(500).json({ error: 'Error' });
                return;
            }
            
        }
    );

    const querySkills = `INSERT INTO skills (skill,level,userId) VALUES (?,?,?)`;
    con.query(querySkills, [skill,level, UserID],
        function(error, result) {
          if (error) {
            console.error('Error during insertion:', error);
            res.status(500).json({ error: 'Error' });
            return;
          }
            res.status(201).json({ 
                message: 'Successfully inserted', 
                id: result.insertId 
            });
        }
    );
    
});

// Route API pour inserer dans la table experience
app.post('/fourthPage', function(req, res) {
    const { 
        JobTitle, city, company, startDate, endDate, description
    } = req.body;

    console.log('Données reçues:', req.body);

    const query = `INSERT INTO experience (JobTitle, city, company, startDate, endDate, description, userId) VALUES (?, ?, ?, ?, ?, ? ,?)`;

    con.query(
        query, 
        [JobTitle, city, company, startDate, endDate, description, UserID],
        function(error, result) {
            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
                return;
            }
            res.status(201).json({ 
                message: 'Utilisateur créé avec succès', 
                id: result.insertId 
            });
        }
    );
});

// Route API pour inserer dans la table courses, languages et interests
app.post('/fifthPage', function(req, res) {
    const { 
        Interest, Hobbies, Languages, level, course, Institution, StartDate, EndDate, Description
    } = req.body;

    console.log('Données reçues:', req.body);

    const queryCourses = `INSERT INTO courses (course, Institution, StartDate, EndDate, Description, userId) VALUES (?, ?, ?, ?, ?,1)`;

    con.query(
        queryCourses, 
        [course, Institution, StartDate, EndDate, Description],
        function(error, result) {
            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement 1' });
                return;
            }
            
        }
    );

    const queryLanguages = `INSERT INTO languages (Languages, level, userId) VALUES (?, ? ,1)`;

    con.query(
        queryLanguages, 
        [Languages, level ],
        function(error, result) {
            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement 2' });
                return;
            }
            
        }
    );

    const queryInterest = `INSERT INTO interests (Interests, Hobbies, userId) VALUES (?, ? ,1)`;

    con.query(
        queryInterest, 
        [Interest, Hobbies],
        function(error, result) {
            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement 3' });
                return;
            }
            res.status(201).json({ 
                message: 'Utilisateur créé avec succès', 
                id: result.insertId 
            });
        }
    );
});

// une get request pour afficher les données dans un modèle de CV
app.get('/AfficherCV/:id', (req, res) => {
    const userId = req.params.id; 
    const queries = {
        heading: 'SELECT * FROM heading WHERE userId = ?',
        education: 'SELECT * FROM education WHERE userId = ?',
        profile: 'SELECT * FROM profile WHERE userId = ?',
        skills: 'SELECT * FROM skills WHERE userId = ?',
        experience: 'SELECT * FROM experience WHERE userId = ?',
        courses: 'SELECT * FROM courses WHERE userId = ?',
        interests: 'SELECT * FROM interests WHERE userId = ?',
        languages: 'SELECT * FROM languages WHERE userId = ?'
    };

    const executeQuery = (query, userId) => {
        return new Promise((resolve, reject) => {
            con.query(query, [userId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    
    Promise.all([
        executeQuery(queries.heading, userId),
        executeQuery(queries.education, userId),
        executeQuery(queries.profile, userId),
        executeQuery(queries.skills, userId),
        executeQuery(queries.experience, userId),
        executeQuery(queries.courses, userId),
        executeQuery(queries.interests, userId),
        executeQuery(queries.languages, userId)
    ])
        .then(results => {
            // Construction des données du CV
            const cvData = {
                heading: results[0][0] || {}, 
                education: results[1],
                profile: results[2],
                skills: results[3],
                experience: results[4],
                courses: results[5],
                interests: results[6],
                languages: results[7]
            };
            res.json(cvData);
        })
        .catch(error => {
            console.error('Error fetching CV data:', error);
            res.status(500).json({ error: 'Database error' });
        });
});
