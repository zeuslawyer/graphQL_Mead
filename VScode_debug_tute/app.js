const express = require("express");

const app = express();
const name = "Zubin";
const person = "Ada Lovelace";

app.get("/", (req, res) => {
  // debugger;
  res.send(`Welcome there, ${name}`);
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
