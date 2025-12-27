import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../core/domain/transaction.model';
import { TransactionRepository } from '../../core/repositories/transaction-repository.interface';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('TransactionRepository')
    private readonly repository: TransactionRepository,
  ) {}

  async add(transaction: Transaction): Promise<void> {
    await this.repository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Transaction> {
    const transactions = await this.repository.findAll();
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transactions = await this.repository.findAll();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    const updatedTransaction = {
      ...transactions[index],
      ...dto,
      date: dto.date ? new Date(dto.date) : transactions[index].date,
    };

    transactions[index] = updatedTransaction;
    return updatedTransaction;
  }

  async delete(id: string): Promise<void> {
    const transactions = await this.repository.findAll();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    transactions.splice(index, 1);
  }
}
