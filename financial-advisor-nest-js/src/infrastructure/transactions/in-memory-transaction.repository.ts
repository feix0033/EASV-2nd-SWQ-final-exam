import { TransactionRepository } from '../../core/repositories/transaction-repository.interface';
import {
  Transaction,
  TransactionType,
} from '../../core/domain/transaction.model';

export class InMemoryTransactionRepository implements TransactionRepository {
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
      amount: 50,
      type: TransactionType.EXPENSE,
      date: new Date('2025-01-02'),
      description: 'Groceries',
    },
    {
      id: '3',
      amount: 200,
      type: TransactionType.EXPENSE,
      date: new Date('2025-01-03'),
      description: 'Utilities',
    },
  ];

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions;
  }
}
