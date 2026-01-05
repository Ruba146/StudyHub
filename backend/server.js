const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studyhub_db'
});

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Connected to MySQL");
});

app.post('/submit-contact', (req, res) => {
    const { fullname, gender, mobile, dob, email, language, message } = req.body;
    const sql = "INSERT INTO contacts (fullname, gender, mobile, dob, email, language, message) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [fullname, gender, mobile, dob, email, language, message], () => {
        res.redirect('/html/index.html');
    });
});

app.post('/add-subject', (req, res) => {
    const { subjectName, subjectCode, credits, notes } = req.body;
    const sql = "INSERT INTO subjects (name, code, credits, notes) VALUES (?, ?, ?, ?)";
    db.query(sql, [subjectName, subjectCode, credits, notes], () => {
        res.redirect('/html/subjects.html');
    });
});

app.post('/add-assignment', (req, res) => {
    const { subject, title, type, dueDate, status, notes } = req.body;
    if (!subject || !title || title.length < 3 || !dueDate || !status || !type) {
        return res.status(400).send("Invalid input");
    }
    const sql = "INSERT INTO assignments (subject, title, type, due_date, status, notes) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [subject, title, type, dueDate, status, notes], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.redirect('/html/tasks.html');
    });
});

app.get('/assignments-list', (req, res) => {
    db.query("SELECT * FROM assignments ORDER BY due_date ASC", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.get('/finish-assignment/:id', (req, res) => {
    const id = req.params.id;
    db.query("UPDATE assignments SET status='Completed' WHERE id=?", [id], (err) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.post('/edit-assignment/:id', (req, res) => {
    const id = req.params.id;
    const { title, type, due_date, status } = req.body;
    const sql = "UPDATE assignments SET title=?, type=?, due_date=?, status=? WHERE id=?";
    db.query(sql, [title, type, due_date, status, id], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

app.delete('/delete-assignment/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM assignments WHERE id=?", [id], () => {
        res.json({ success: true });
    });
});

app.get('/subjects-list', (req, res) => {
    db.query("SELECT * FROM subjects", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});