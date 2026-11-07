const express = require("express");
const path = require("path");

const app = express();
app.disable("x-powered-by");
app.use(express.static(__dirname, { extensions: ["html"] }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("static examples on " + port);
});
