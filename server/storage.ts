import { 
  type User, type InsertUser, 
  type Checkout, type InsertCheckout,
  users, checkouts, checkins
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCheckout(checkout: InsertCheckout): Promise<Checkout>;
  getCheckouts(): Promise<Checkout[]>;
  createCheckIn(routineId: string): Promise<void>;
  getCheckInData(): Promise<{daily: number, weekly: number, monthly: number, breakdown: Record<string, number>}>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createCheckout(insertCheckout: InsertCheckout): Promise<Checkout> {
    const [checkout] = await db.insert(checkouts).values({
      ...insertCheckout,
      userId: insertCheckout.userId ?? null,
      status: insertCheckout.status ?? "pending",
    }).returning();
    return checkout;
  }

  async getCheckouts(): Promise<Checkout[]> {
    return db.select().from(checkouts);
  }

  async createCheckIn(routineId: string): Promise<void> {
    await db.insert(checkins).values({ routineId });
  }

  async getCheckInData(): Promise<{daily: number, weekly: number, monthly: number, breakdown: Record<string, number>}> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [dailyRes] = await db.select({ count: sql<number>`count(*)` })
      .from(checkins)
      .where(gte(checkins.timestamp, startOfDay));
    
    const [weeklyRes] = await db.select({ count: sql<number>`count(*)` })
      .from(checkins)
      .where(gte(checkins.timestamp, startOfWeek));
    
    const [monthlyRes] = await db.select({ count: sql<number>`count(*)` })
      .from(checkins)
      .where(gte(checkins.timestamp, startOfMonth));

    const breakdownRes = await db.select({ 
      routineId: checkins.routineId, 
      count: sql<number>`count(*)` 
    })
    .from(checkins)
    .groupBy(checkins.routineId);

    const breakdown: Record<string, number> = {};
    breakdownRes.forEach(r => {
      breakdown[r.routineId] = Number(r.count);
    });

    return { 
      daily: Number(dailyRes.count), 
      weekly: Number(weeklyRes.count), 
      monthly: Number(monthlyRes.count), 
      breakdown 
    };
  }
}

export const storage = new DatabaseStorage();
