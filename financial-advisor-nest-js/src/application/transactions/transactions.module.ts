import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { InMemoryTransactionRepository } from '../../infrastructure/transactions/in-memory-transaction.repository';

@Module({
    controllers: [TransactionsController],
    providers: [
        TransactionsService,
        {
            provide: 'TransactionRepository',
            useClass: InMemoryTransactionRepository,
        },
    ],
})
export class TransactionsModule {}
