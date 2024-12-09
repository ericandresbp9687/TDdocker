const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// CRUD Endpoints
app.get("/api/items", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM items");
    res.json(rows);
});
app.post("/api/items", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        "INSERT INTO items (name) VALUES ($1) RETURNING *",
        [name]
    );
    res.json(result.rows[0]);
});
app.delete("/api/items/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.sendStatus(204);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
