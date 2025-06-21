import { pgTable, text, serial, integer, boolean, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  member: text("member").notNull(),
  type: text("type").notNull().$type<'Equity' | 'Mutual Fund'>(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  units: numeric("units", { precision: 10, scale: 4 }).notNull(),
  buyPrice: numeric("buy_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  buyDate: date("buy_date").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  investments: many(investments),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.member],
    references: [users.username],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
