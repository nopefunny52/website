const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'form_data.txt');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html when visiting root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/save', (req, res) => {
    const { name} = req.body;

    if (!name) {
        return res.status(400).send('All fields are required.');
    }

    const entry = `Name: ${name}\n\n---\n`;

    try {
        // Append to file
        fs.appendFileSync(DATA_FILE, entry, 'utf8');

        // Read updated file contents
        const fileContents = fs.readFileSync(DATA_FILE, 'utf8');

        // Send back HTML showing file contents
        res.send(`
            <h2>Data Saved Successfully!</h2>
            <pre>${fileContents}</pre>
            <a href="/">Go Back to Form</a>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving data.');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
