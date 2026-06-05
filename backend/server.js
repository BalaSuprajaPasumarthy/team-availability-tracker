const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = "db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/users", (req, res) => {
  const data = readDB();
  res.json(data.users);
});

app.patch("/users/:id", (req, res) => {
  const data = readDB();

  const user = data.users.find(
    (u) => u.id === parseInt(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  user.available = req.body.available;

  writeDB(data);

  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});