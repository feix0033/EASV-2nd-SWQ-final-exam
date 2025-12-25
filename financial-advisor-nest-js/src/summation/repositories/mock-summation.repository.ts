import { Injectable } from '@nestjs/common';
import { ISummationRepository } from '../interfaces/summation-repository.interface';
import { ISummationRecord } from '../interfaces/summation-record.interface';

/**
 * Example implementation using in-memory data
 * Your co-worker will replace this with a real implementation using TypeORM, Prisma, etc.
 */
@Injectable()
export class MockSummationRepository implements ISummationRepository {
  // Mock data for demonstration (positive = income, negative = expenses)
  private mockData: ISummationRecord[] = [
    { amount: 100, date: new Date('2024-01-05') }, // income
    { amount: -50, date: new Date('2024-01-07') }, // expense
    { amount: 200, date: new Date('2024-01-12') }, // income
    { amount: -75, date: new Date('2024-01-15') }, // expense
    { amount: 150, date: new Date('2024-01-20') }, // income
    { amount: 300, date: new Date('2024-02-03') }, // income
    { amount: -120, date: new Date('2024-02-10') }, // expense
    { amount: 250, date: new Date('2024-02-15') }, // income
    { amount: -80, date: new Date('2024-02-20') }, // expense
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
