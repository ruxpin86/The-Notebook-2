const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");

const app = express();
const PORT = 3001;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET route for landing page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET route for note-taking page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/notes", (req, res) => {
  res.status(200).json(notes);
});

app.get("/api/notes", (req, res) => {
  res.json(`${req.method} request received to get notes`);
  console.info(`${req.method} request received to get notes`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
