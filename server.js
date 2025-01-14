const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
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
        city, dateOfBirth, country, nationality, LinkedIn, JobTitle , UserID
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
        school, city, degree, field, startDate, endDate, description,UserID
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
    const { prof, achievment, skill, level,UserID} = req.body;
    const queryProfile = `INSERT INTO profile (prof, achievment, userId) VALUES (?, ?,?)`;
    con.query(queryProfile, [prof, achievment, UserID],function(error, result) {
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
        JobTitle, city, company, startDate, endDate, description,UserID
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
        Interest, Hobbies, Languages, level, course, Institution, StartDate, EndDate, Description, UserID
    } = req.body;

    console.log('Données reçues:', req.body);

    const queryCourses = `INSERT INTO courses (course, Institution, StartDate, EndDate, Description, userId) VALUES (?, ?, ?, ?, ?,?)`;

    con.query(
        queryCourses, 
        [course, Institution, StartDate, EndDate, Description, UserID],
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

    const queryLanguages = `INSERT INTO languages (Languages, level, userId) VALUES (?, ? ,?)`;

    con.query(
        queryLanguages, 
        [Languages, level , UserID],
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

    const queryInterest = `INSERT INTO interests (Interest, Hobbies, userId) VALUES (?, ? ,?)`;

    con.query(
        queryInterest, 
        [Interest, Hobbies, UserID],
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

// une get request pour afficher les données dans un modèle de CV
app.get('/AfficherCV/:id', (req, res) => {
    const userId = req.params.id;
    const queries = {
        heading: 'SELECT * FROM heading WHERE id = ?',
        education: 'SELECT * FROM education WHERE id = ?',
        profile: 'SELECT * FROM profile WHERE id = ?',
        skills: 'SELECT * FROM skills WHERE id = ?',
        experience: 'SELECT * FROM experience WHERE id = ?',
        courses: 'SELECT * FROM courses WHERE id = ?',
        interests: 'SELECT * FROM interests WHERE id = ?',
        Languages:'SELECT * FROM languages WHERE id = ?'
    };
    const cvData = {};

    Promise.all([
        new Promise((resolve, reject) => {
            con.query(queries.heading, [userId], (error, results) => {
                if (error) reject(error);
                cvData.heading = results[0];
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            con.query(queries.education, [userId], (error, results) => {
                if (error) reject(error);
                cvData.education = results;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            con.query(queries.profile, [userId], (error, results) => {
                if (error) reject(error);
                cvData.profile = results;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            con.query(queries.experience, [userId], (error, results) => {
                if (error) reject(error);
                cvData.experience = results;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            con.query(queries.courses, [userId], (error, results) => {
                if (error) reject(error);
                cvData.courses = results;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
          con.query(queries.interests, [userId], (error, results) => {
              if (error) reject(error);
              cvData.interests = results;
              resolve();
          });
        }),
        new Promise((resolve, reject) => {
          con.query(queries.Languages, [userId], (error, results) => {
              if (error) reject(error);
              cvData.Languages = results;
              resolve();
          });
        }),
    ])
    .then(() => {
        res.json(cvData);
    })
    .catch(error => {
        console.error('Error fetching CV data:', error);
        res.status(500).json({ error: 'Database error' });
    });
});


    