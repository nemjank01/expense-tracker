import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3000;

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB

//ROUTES
app.get("/", (req, res) => {
  res.send("API WORKS!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
