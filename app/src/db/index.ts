import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Conexión a SQLite
const sqlite = new Database("inventario.db");
export const db = drizzle(sqlite, { schema });
