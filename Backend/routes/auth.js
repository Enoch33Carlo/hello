import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";  // your DB connection file

const router = express.Router();

// POST /login
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const table = role === "faculty" ? "faculty" : "students";

  db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length === 0) return res.status(401).send("User not found");

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).send("Invalid password");

    res.json({ message: "Login successful", user });
  });
});

export default router;
