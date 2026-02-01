import { type User, type InsertUser, type Checkout, type InsertCheckout } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCheckout(checkout: InsertCheckout): Promise<Checkout>;
  getCheckouts(): Promise<Checkout[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private checkouts: Map<string, Checkout>;

  constructor() {
    this.users = new Map();
    this.checkouts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCheckout(insertCheckout: InsertCheckout): Promise<Checkout> {
    const id = randomUUID();
    const checkout: Checkout = { 
      ...insertCheckout, 
      id, 
      userId: insertCheckout.userId ?? null,
      status: insertCheckout.status ?? "pending",
      createdAt: new Date() 
    };
    this.checkouts.set(id, checkout);
    return checkout;
  }

  async getCheckouts(): Promise<Checkout[]> {
    return Array.from(this.checkouts.values());
  }
}

export const storage = new MemStorage();
