const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http.error");
const connectDB = require("./config/db");
const port = 3000;

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error;
})

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An Unknown error occurred!" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
