import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Generic JSON file storage utility
 * Provides simple CRUD operations for storing data in JSON files
 *
 * Usage:
 *   const storage = new JsonStorage<MyEntity>('mydata.json');
 *   const items = await storage.read();
 *   await storage.write(items);
 */
export class JsonStorage<T> {
  private readonly filePath: string;

  constructor(filename: string) {
    // Store in project root/data folder
    this.filePath = path.join(process.cwd(), 'data', filename);
  }

  /**
   * Read all items from JSON file
   * Returns empty array if file doesn't exist
   */
  async read(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch (error) {
      // If file doesn't exist, return empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Write all items to JSON file
   * Creates data directory if it doesn't exist
   */
  async write(data: T[]): Promise<void> {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Find item by id
   * Note: Assumes items have an 'id' property
   */
  findById(id: string, items: T[]): T | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const found = items.find((item) => (item as any).id === id);
    return found || null;
  }

  /**
   * Check if file exists
   */
  async exists(): Promise<boolean> {
    try {
      await fs.access(this.filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete the JSON file
   */
  async delete(): Promise<void> {
    try {
      await fs.unlink(this.filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
