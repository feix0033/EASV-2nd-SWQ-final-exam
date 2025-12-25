# Migration Guide: Implementing Features with Onion Architecture

This guide teaches you how to implement new features following our onion architecture pattern, using JSON files as the data storage layer.

## Architecture Overview

```
Core (Domain)          → Defines WHAT (interfaces, entities)
Application (Use Cases) → Defines HOW (business logic)
Infrastructure (Data)   → Defines WHERE (JSON files, databases)
```

## Step-by-Step Implementation Guide

### Phase 1: Define the Domain (Core Layer)

Start from the **innermost layer** - the domain.

#### 1.1 Create Domain Entity

**Location:** `src/core/domain/`

```typescript
// src/core/domain/transaction.interface.ts
export interface ITransaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  type: 'income' | 'expense';
}
```

**Principles:**
- ✅ Only domain properties (no database fields like `createdAt`)
- ✅ Use business terminology (not technical terms)
- ✅ Keep it simple and focused

#### 1.2 Create Repository Interface

**Location:** `src/core/repositories/`

```typescript
// src/core/repositories/transaction-repository.interface.ts
import { ITransaction } from '../domain/transaction.interface';

export interface ITransactionRepository {
  // Query methods
  findAll(): Promise<ITransaction[]>;
  findById(id: string): Promise<ITransaction | null>;
  findByCategory(category: string): Promise<ITransaction[]>;
  findByDateRange(start: Date, end: Date): Promise<ITransaction[]>;

  // Command methods
  create(transaction: ITransaction): Promise<ITransaction>;
  update(id: string, transaction: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}
```

**Principles:**
- ✅ Define operations the domain needs
- ✅ Use domain language (not SQL or database terms)
- ✅ Return domain entities, not DTOs
- ✅ Use async/Promise for all operations

#### 1.3 Export from Core

**Location:** `src/core/index.ts`

```typescript
// Add to existing exports
export * from './domain/transaction.interface';
export * from './repositories/transaction-repository.interface';
```

---

### Phase 2: Implement Infrastructure (JSON Storage)

Now implement the **outermost layer** - data storage.

#### 2.1 Create JSON Storage Utility

**Location:** `src/infrastructure/storage/json-storage.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class JsonStorage<T> {
  private readonly filePath: string;

  constructor(filename: string) {
    // Store in project root/data folder
    this.filePath = path.join(process.cwd(), 'data', filename);
  }

  async read(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async write(data: T[]): Promise<void> {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findById(id: string, items: T[]): Promise<T | null> {
    return items.find((item: any) => item.id === id) || null;
  }
}
```

#### 2.2 Implement Repository

**Location:** `src/infrastructure/repositories/`

```typescript
// src/infrastructure/repositories/transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { ITransactionRepository, ITransaction } from '../../core';
import { JsonStorage } from '../storage/json-storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  private storage: JsonStorage<ITransaction>;

  constructor() {
    this.storage = new JsonStorage<ITransaction>('transactions.json');
  }

  async findAll(): Promise<ITransaction[]> {
    return this.storage.read();
  }

  async findById(id: string): Promise<ITransaction | null> {
    const items = await this.storage.read();
    return this.storage.findById(id, items);
  }

  async findByCategory(category: string): Promise<ITransaction[]> {
    const items = await this.storage.read();
    return items.filter((item) => item.category === category);
  }

  async findByDateRange(start: Date, end: Date): Promise<ITransaction[]> {
    const items = await this.storage.read();
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  async create(transaction: ITransaction): Promise<ITransaction> {
    const items = await this.storage.read();
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      date: new Date(transaction.date), // Ensure Date type
    };
    items.push(newTransaction);
    await this.storage.write(items);
    return newTransaction;
  }

  async update(
    id: string,
    transaction: Partial<ITransaction>,
  ): Promise<ITransaction> {
    const items = await this.storage.read();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    const updated = { ...items[index], ...transaction };
    items[index] = updated;
    await this.storage.write(items);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const items = await this.storage.read();
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    await this.storage.write(filtered);
  }
}
```

#### 2.3 Register in Infrastructure Module

**Location:** `src/infrastructure/infrastructure.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CoreModule } from '../core';
import { MockSummationRepository } from './repositories/mock-summation.repository';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  imports: [CoreModule],
  providers: [
    {
      provide: 'ISummationRepository',
      useClass: MockSummationRepository,
    },
    {
      provide: 'ITransactionRepository', // Add new repository
      useClass: TransactionRepository,
    },
  ],
  exports: ['ISummationRepository', 'ITransactionRepository'], // Export it
})
export class InfrastructureModule {}
```

---

### Phase 3: Create Application Layer (Use Cases)

Now implement the **middle layer** - business logic.

#### 3.1 Create DTOs

**Location:** `src/application/transactions/dto/`

```typescript
// src/application/transactions/dto/create-transaction.dto.ts
export class CreateTransactionDto {
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date?: Date; // Optional, defaults to now
}

// src/application/transactions/dto/update-transaction.dto.ts
export class UpdateTransactionDto {
  amount?: number;
  category?: string;
  description?: string;
  type?: 'income' | 'expense';
  date?: Date;
}

// src/application/transactions/dto/transaction-response.dto.ts
export class TransactionResponseDto {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: Date;
}
```

#### 3.2 Create Service

**Location:** `src/application/transactions/`

```typescript
// src/application/transactions/transactions.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITransactionRepository, ITransaction } from '../../core';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly repository: ITransactionRepository,
  ) {}

  async findAll(): Promise<ITransaction[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<ITransaction> {
    const transaction = await this.repository.findById(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async findByCategory(category: string): Promise<ITransaction[]> {
    return this.repository.findByCategory(category);
  }

  async create(dto: CreateTransactionDto): Promise<ITransaction> {
    const transaction: ITransaction = {
      id: '', // Will be generated by repository
      amount: dto.amount,
      category: dto.category,
      description: dto.description,
      type: dto.type,
      date: dto.date || new Date(),
    };
    return this.repository.create(transaction);
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<ITransaction> {
    // Ensure transaction exists
    await this.findById(id);
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    // Ensure transaction exists
    await this.findById(id);
    return this.repository.delete(id);
  }
}
```

#### 3.3 Create Controller

**Location:** `src/application/transactions/`

```typescript
// src/application/transactions/transactions.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.transactionsService.findById(id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.transactionsService.findByCategory(category);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionsService.delete(id);
  }
}
```

#### 3.4 Create Module

**Location:** `src/application/transactions/`

```typescript
// src/application/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { CoreModule } from '../../core';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [CoreModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
```

#### 3.5 Register in App Module

**Location:** `src/app.module.ts`

```typescript
@Module({
  imports: [
    InfrastructureModule,
    SummationModule,
    TransactionsModule, // Add new module
  ],
  // ...
})
export class AppModule {}
```

---

## Common Patterns

### Pattern 1: Seeding Initial Data

```typescript
// src/infrastructure/repositories/transaction.repository.ts
constructor() {
  this.storage = new JsonStorage<ITransaction>('transactions.json');
  this.seedInitialData(); // Seed on first run
}

private async seedInitialData(): Promise<void> {
  const items = await this.storage.read();
  if (items.length === 0) {
    const seedData: ITransaction[] = [
      {
        id: '1',
        amount: 1000,
        category: 'Salary',
        description: 'Monthly salary',
        type: 'income',
        date: new Date('2024-01-01'),
      },
      // Add more seed data...
    ];
    await this.storage.write(seedData);
  }
}
```

### Pattern 2: Validation in DTOs

```typescript
// Install: npm install class-validator class-transformer
import { IsNumber, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsOptional()
  @IsDate()
  date?: Date;
}
```

### Pattern 3: Complex Queries

```typescript
// In repository
async findByFilters(filters: {
  category?: string;
  type?: 'income' | 'expense';
  startDate?: Date;
  endDate?: Date;
}): Promise<ITransaction[]> {
  let items = await this.storage.read();

  if (filters.category) {
    items = items.filter((item) => item.category === filters.category);
  }

  if (filters.type) {
    items = items.filter((item) => item.type === filters.type);
  }

  if (filters.startDate && filters.endDate) {
    items = items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= filters.startDate! && itemDate <= filters.endDate!;
    });
  }

  return items;
}
```

---

## Checklist for New Features

- [ ] **Core Layer**
  - [ ] Define domain entity in `core/domain/`
  - [ ] Define repository interface in `core/repositories/`
  - [ ] Export from `core/index.ts`

- [ ] **Infrastructure Layer**
  - [ ] Implement repository in `infrastructure/repositories/`
  - [ ] Use `JsonStorage` utility
  - [ ] Register in `infrastructure.module.ts`

- [ ] **Application Layer**
  - [ ] Create DTOs in `application/{feature}/dto/`
  - [ ] Create service in `application/{feature}/`
  - [ ] Create controller in `application/{feature}/`
  - [ ] Create module in `application/{feature}/`
  - [ ] Register in `app.module.ts`

- [ ] **Testing**
  - [ ] Test endpoints with Postman/curl
  - [ ] Verify JSON file is created in `data/` folder
  - [ ] Check data persistence across restarts

---

## Directory Structure After Implementation

```
src/
├── core/
│   ├── domain/
│   │   ├── summation-record.interface.ts
│   │   └── transaction.interface.ts           ✨ NEW
│   ├── repositories/
│   │   ├── summation-repository.interface.ts
│   │   └── transaction-repository.interface.ts ✨ NEW
│   └── index.ts                                (updated)
│
├── application/
│   ├── summation/
│   └── transactions/                           ✨ NEW
│       ├── dto/
│       ├── transactions.controller.ts
│       ├── transactions.service.ts
│       └── transactions.module.ts
│
├── infrastructure/
│   ├── repositories/
│   │   ├── mock-summation.repository.ts
│   │   └── transaction.repository.ts          ✨ NEW
│   ├── storage/
│   │   └── json-storage.ts                    ✨ NEW
│   └── infrastructure.module.ts                (updated)
│
└── app.module.ts                               (updated)

data/                                           ✨ NEW (gitignored)
└── transactions.json
```

---

## Tips & Best Practices

1. **Always start from Core** - Define the domain first, implementation last
2. **One responsibility per layer** - Don't mix concerns
3. **Use dependency injection** - Never import infrastructure in application
4. **Keep DTOs thin** - Just data, no logic
5. **Repository = Data access** - No business logic here
6. **Service = Business logic** - This is where rules go
7. **JSON files in data/** - Add `data/` to `.gitignore`

---

## Next Steps

Once comfortable with JSON storage, you can easily swap to a real database:

1. Create new repository implementation (e.g., `TypeOrmTransactionRepository`)
2. Update provider in `infrastructure.module.ts`
3. **No changes needed** in core or application layers!

This is the power of onion architecture! 🎯
