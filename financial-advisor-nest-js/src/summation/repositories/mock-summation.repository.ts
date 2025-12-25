import { Injectable } from '@nestjs/common';
import { ISummationRepository } from '../interfaces/summation-repository.interface';
import { ISummationRecord } from '../interfaces/summation-record.interface';

/**
 * Example implementation using in-memory data
 * Your co-worker will replace this with a real implementation using TypeORM, Prisma, etc.
 */
@Injectable()
export class MockSummationRepository implements ISummationRepository {
  // Mock data for demonstration
  private mockData: ISummationRecord[] = [
    { amount: 100, date: new Date('2024-01-05') },
    { amount: 200, date: new Date('2024-01-12') },
    { amount: 150, date: new Date('2024-01-20') },
    { amount: 300, date: new Date('2024-02-03') },
    { amount: 250, date: new Date('2024-02-15') },
  ];

  findByDateRange(startDate: Date, endDate: Date): Promise<ISummationRecord[]> {
    return Promise.resolve(
      this.mockData.filter(
        (record) => record.date >= startDate && record.date <= endDate,
      ),
    );
  }

  findAll(): Promise<ISummationRecord[]> {
    return Promise.resolve(this.mockData);
  }
}
