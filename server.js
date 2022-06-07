const express = require("express");
const path = require("path");
const noteData = require("./db/db.json");
const fs = require("fs");
const uuid = require("./middleware/uuid.js");

const app = express();
const PORT = 3001;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET route for landing page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// GET route for note-taking page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/notes", (req, res) => {
  res.status(200).json(noteData);
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

app.post("/api/notes", async (req, res) => {
  console.info(`${req.method} request received to get notes`);

  const { title, text } = req.body;

  if (title && text) {
    await readAndAppend({ ...req.body, id: uuid() }, "./db/db.json");
    res.status(200).send("Post /api/notes route SUCCESS!");
  } else {
    res.status(400).send("Bad user request.");
  }
});

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
