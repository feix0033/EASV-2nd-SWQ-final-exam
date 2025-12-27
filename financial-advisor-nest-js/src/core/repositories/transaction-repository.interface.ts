import { Transaction } from '../domain/transaction.model';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findAll(): Promise<Transaction[]>;
}
