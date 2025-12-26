import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '../../core/domain/transaction.model';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly service: TransactionsService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new transaction' })
    @ApiResponse({ status: 201, description: 'Transaction created' })
    create(@Body() dto: CreateTransactionDto): Transaction {
        const transaction: Transaction = {
            id: randomUUID(),
            amount: dto.amount,
            type: dto.type,
            date: new Date(dto.date),
            description: dto.description,
        };

        this.service.add(transaction);
        return transaction;
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions' })
    @ApiResponse({ status: 200, description: 'List of transactions' })
    findAll(): Promise<Transaction[]> {
        return this.service.findAll();
    }
}
