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

  async getCheckInData(): Promise<{ 
    daily: number, 
    weekly: number, 
    monthly: number, 
    breakdown: Record<string, number>,
    weeklyHistory: { date: string, percentage: number }[]
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);

    const [dailyRes] = await db.select({ count: sql<number>`count(DISTINCT routine_id)` })
      .from(checkins)
      .where(gte(checkins.timestamp, startOfDay));
    
    const weeklyData = await db.select({
      day: sql<string>`DATE(timestamp)`,
      count: sql<number>`count(DISTINCT routine_id)`
    })
      .from(checkins)
      .where(gte(checkins.timestamp, startOfWeek))
      .groupBy(sql`DATE(timestamp)`);
    
    const monthlyData = await db.select({
      day: sql<string>`DATE(timestamp)`,
      count: sql<number>`count(DISTINCT routine_id)`
    })
      .from(checkins)
      .where(gte(checkins.timestamp, startOfMonth))
      .groupBy(sql`DATE(timestamp)`);

    const weeklySum = weeklyData.reduce((acc, curr) => acc + Number(curr.count), 0);
    const monthlySum = monthlyData.reduce((acc, curr) => acc + Number(curr.count), 0);

    // Generate last 7 days history
    const weeklyHistory: { date: string, percentage: number }[] = [];
    const totalRoutines = 7; // Matching routineData.length from HomeScreen
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = weeklyData.find(w => w.day === dateStr);
      const count = dayData ? Number(dayData.count) : 0;
      weeklyHistory.push({
        date: dateStr,
        percentage: Math.round((count / totalRoutines) * 100)
      });
    }

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
      weekly: weeklySum, 
      monthly: monthlySum, 
      breakdown,
      weeklyHistory
    };
  }
}

export const storage = new DatabaseStorage();
