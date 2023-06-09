const express = require("express");
const app = express();
const placesRoutes = require("./routes/places-routes");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/places", placesRoutes);

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An Unknown error occurred!" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
