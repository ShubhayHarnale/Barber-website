import { 
  users, type User, type InsertUser, 
  contactMessages, type ContactMessage, type ContactMessageInput 
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contact messages methods
  createContactMessage(message: ContactMessageInput): Promise<ContactMessage>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, ContactMessage>;
  private userCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contact message methods
  async createContactMessage(messageData: ContactMessageInput): Promise<ContactMessage> {
    const id = this.messageCurrentId++;
    const timestamp = new Date();
    const message: ContactMessage = { 
      ...messageData, 
      id, 
      createdAt: timestamp,
      subject: messageData.subject || null
    };
    
    this.messages.set(id, message);
    return message;
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.messages.get(id);
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.messages.values()).sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  }
}

export const storage = new MemStorage();
