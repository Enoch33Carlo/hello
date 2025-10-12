import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open SQLite database connection
export async function openDb() {
  const db = await open({
    filename: "./events.db",
    driver: sqlite3.Database,
  });

  // Create table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT,
      email TEXT,
      department TEXT,
      message TEXT,
      eventTitle TEXT,
      registeredAt TEXT
    );
  `);

  return db;
}
