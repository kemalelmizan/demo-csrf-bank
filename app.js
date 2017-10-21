const express = require("express");
const app = express();

app.get("/halo", (req, res) => {
  res.send("Halo dunia!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Open http://localhost:" + port);
});