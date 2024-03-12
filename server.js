const pg = require("pg");
const express = require("express");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_flavors_db"
);
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

app.post("/api/flavors", async (req, res, next) => {
  try {
    res.status(201).json({ message: "Flavor created successfully" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/flavors", async (req, res, next) => {
  try {
    res.json({ flavors: [] });
  } catch (error) {
    next(error);
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    res.json({ message: "Flavor updated successfully" });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    let SQL = `
      DROP TABLE IF EXISTS flavors;
      CREATE TABLE flavors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_favorite BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `;
    await client.query(SQL);
    console.log("Tables created");

    SQL = `
      INSERT INTO flavors (name) VALUES ('chocolate');
      INSERT INTO flavors (name) VALUES ('vanilla');
      INSERT INTO flavors (name) VALUES ('strawberry');
    `;
    await client.query(SQL);
    console.log("Data seeded");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (error) {
    console.error("Error initializing application:", error);
    process.exit(1);
  }
};

init();
