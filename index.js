const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5003;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("toy store server is running");
});

app.listen(port, () => {
  console.log(`toy store server running on port : ${port}`);
})