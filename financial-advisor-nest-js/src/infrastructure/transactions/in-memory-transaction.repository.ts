import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../core/repositories/transaction-repository.interface';
import { ISummationRepository } from '../../core/repositories/summation-repository.interface';
import { ISummationTransaction } from '../../core/domain/summation-transaction.interface';
import {
  Transaction,
  TransactionType,
} from '../../core/domain/transaction.model';

/**
 * In-memory implementation of both TransactionRepository and ISummationRepository
 * This provides a unified data source for both Transaction CRUD and Summation features
 */
@Injectable()
export class InMemoryTransactionRepository
  implements TransactionRepository, ISummationRepository
{
  private transactions: Transaction[] = [
    {
      id: '1',
      amount: 1000,
      type: TransactionType.INCOME,
      date: new Date('2025-01-01'),
      description: 'Salary',
    },
    {
      id: '2',
      amount: -50,
      type: TransactionType.EXPENSE,
      date: new Date('2025-01-02'),
      description: 'Groceries',
    },
    {
      id: '3',
      amount: -200,
      type: TransactionType.EXPENSE,
      date: new Date('2025-01-03'),
      description: 'Utilities',
    },
  ];

  // TransactionRepository methods
  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions;
  }

  // ISummationRepository methods
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ISummationTransaction[]> {
    return this.transactions.filter(
      (transaction) =>
        transaction.date >= startDate && transaction.date <= endDate,
    );
  }
}
