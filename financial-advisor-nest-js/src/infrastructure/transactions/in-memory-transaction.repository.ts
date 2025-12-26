import { TransactionRepository } from '../../core/repositories/transaction-repository.interface';
import { Transaction } from '../../core/domain/transaction.model';

export class InMemoryTransactionRepository
    implements TransactionRepository {

    private transactions: Transaction[] = [];

    async save(transaction: Transaction): Promise<void> {
        this.transactions.push(transaction);
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactions;
    }
}
