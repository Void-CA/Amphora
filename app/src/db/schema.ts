import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const productos = sqliteTable("productos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  cantidad: integer("cantidad").notNull(),
  precio: real("precio").notNull(),
  categoria: text("categoria")
});
