const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8000;

const filePath = path.join(__dirname, "data", "events.json");

app.use(cors());
app.use(express.json());

function readEvents() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeEvents(events) {
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
}

function isValidEvent(event) {
  return (
    event.title?.trim() &&
    event.description?.trim() &&
    event.date &&
    event.venue?.trim() &&
    Number(event.maxTeams) > 0 &&
    ["Open", "Closed"].includes(event.status)
  );
}

// READ
app.get("/events", (req, res) => {
  res.json(readEvents());
});

// CREATE
app.post("/events", (req, res) => {
  if (!isValidEvent(req.body)) {
    return res.status(400).json({
      message: "Please enter valid details in every field.",
    });
  }

  const events = readEvents();

  const newEvent = {
    ...req.body,
    id: events.length ? Math.max(...events.map((event) => event.id)) + 1 : 1,
    maxTeams: Number(req.body.maxTeams),
  };

  events.push(newEvent);
  writeEvents(events);

  res.status(201).json(newEvent);
});

// UPDATE
app.put("/events/:id", (req, res) => {
  if (!isValidEvent(req.body)) {
    return res.status(400).json({
      message: "Please enter valid details in every field.",
    });
  }

  const events = readEvents();
  const index = events.findIndex(
    (event) => event.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Event not found." });
  }

  events[index] = {
    ...req.body,
    id: events[index].id,
    maxTeams: Number(req.body.maxTeams),
  };

  writeEvents(events);

  res.json(events[index]);
});

// DELETE
app.delete("/events/:id", (req, res) => {
  const events = readEvents();

  const remainingEvents = events.filter(
    (event) => event.id !== Number(req.params.id)
  );

  if (remainingEvents.length === events.length) {
    return res.status(404).json({ message: "Event not found." });
  }

  writeEvents(remainingEvents);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`HackConnect API running at http://localhost:${PORT}`);
});