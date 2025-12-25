import { Injectable } from '@nestjs/common';
import { ISummationRepository, ISummationTransaction } from '../../core';

/**
 * Example implementation using in-memory data
 * Todo: Replace this with a real implementation using TypeORM, Prisma, etc.
 */
@Injectable()
export class MockSummationRepository implements ISummationRepository {
  // Mock data for demonstration (positive = income, negative = expenses)
  private mockData: ISummationTransaction[] = [
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

  findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ISummationTransaction[]> {
    return Promise.resolve(
      this.mockData.filter(
        (transaction) =>
          transaction.date >= startDate && transaction.date <= endDate,
      ),
    );
  }

  findAll(): Promise<ISummationTransaction[]> {
    return Promise.resolve(this.mockData);
  }
}
