import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResultDto } from './dto/transaction-result.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from '../../core/domain/transaction.model';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: TransactionResultDto,
  })
  create(@Body() dto: CreateTransactionDto): TransactionResultDto {
    const transaction: Transaction = {
      id: randomUUID(),
      amount: dto.amount,
      type: dto.type,
      date: new Date(dto.date),
      description: dto.description,
    };

    this.service.add(transaction);
    return {
      ...transaction,
      date: transaction.date.toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [TransactionResultDto],
  })
  async findAll(): Promise<TransactionResultDto[]> {
    const transactions = await this.service.findAll();
    return transactions.map((t) => ({
      ...t,
      date: t.date.toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResultDto,
  })
  async findOne(@Param('id') id: string): Promise<TransactionResultDto> {
    const transaction = await this.service.findById(id);
    return {
      ...transaction,
      date: transaction.date.toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated',
    type: TransactionResultDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionResultDto> {
    const transaction = await this.service.update(id, dto);
    return {
      ...transaction,
      date: transaction.date.toISOString(),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
