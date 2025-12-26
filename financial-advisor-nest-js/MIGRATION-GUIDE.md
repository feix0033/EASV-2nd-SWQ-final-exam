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

## Implementing ISummationTransaction

The `ISummationTransaction` interface is the domain entity for financial transactions in the summation feature. This section provides guidance on implementing repositories for this interface.

### Interface Definition

**Location:** `src/core/domain/summation-transaction.interface.ts`

```typescript
export interface ISummationTransaction {
  amount: number;  // Transaction amount (positive for income, negative for expenses)
  date: Date;      // Transaction date
  // Add other fields as needed, but the service only needs these two
}
```

### Repository Interface

**Location:** `src/core/repositories/summation-repository.interface.ts`

```typescript
export interface ISummationRepository {
  findByDateRange(startDate: Date, endDate: Date): Promise<ISummationTransaction[]>;
  findAll(): Promise<ISummationTransaction[]>;
}
```

### Implementation Strategies

You can implement `ISummationRepository` using different persistence strategies. Here are the most common approaches:

---

#### Strategy 1: Mock Implementation (In-Memory)

**Best for:** Development, testing, and prototyping

**Location:** `src/infrastructure/repositories/mock-summation.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ISummationRepository, ISummationTransaction } from '../../core';

@Injectable()
export class MockSummationRepository implements ISummationRepository {
  private mockData: ISummationTransaction[] = [
    { amount: 100, date: new Date('2024-01-05') },
    { amount: -50, date: new Date('2024-01-07') },
    { amount: 200, date: new Date('2024-01-12') },
    { amount: -75, date: new Date('2024-01-15') },
  ];

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ISummationTransaction[]> {
    return this.mockData.filter(
      (transaction) => transaction.date >= startDate && transaction.date <= endDate,
    );
  }

  async findAll(): Promise<ISummationTransaction[]> {
    return this.mockData;
  }
}
```

**Pros:**
- ✅ Fast and simple
- ✅ No database setup required
- ✅ Perfect for testing

**Cons:**
- ❌ Data lost on restart
- ❌ Not suitable for production

---

#### Strategy 2: JSON File Storage

**Best for:** Small-scale applications, learning, rapid prototyping

**Location:** `src/infrastructure/repositories/json-summation.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ISummationRepository, ISummationTransaction } from '../../core';
import { JsonStorage } from '../storage/json-storage';

@Injectable()
export class JsonSummationRepository implements ISummationRepository {
  private storage: JsonStorage<ISummationTransaction>;

  constructor() {
    this.storage = new JsonStorage<ISummationTransaction>('summation-transactions.json');
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ISummationTransaction[]> {
    const transactions = await this.storage.read();
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  async findAll(): Promise<ISummationTransaction[]> {
    return this.storage.read();
  }

  // Optional: Add methods for creating transactions
  async create(transaction: ISummationTransaction): Promise<ISummationTransaction> {
    const transactions = await this.storage.read();
    transactions.push({
      ...transaction,
      date: new Date(transaction.date),
    });
    await this.storage.write(transactions);
    return transaction;
  }
}
```

**Pros:**
- ✅ Data persists across restarts
- ✅ Easy to inspect data (just open JSON file)
- ✅ No database installation needed

**Cons:**
- ❌ Not suitable for large datasets
- ❌ No concurrent access handling

---

#### Strategy 3: TypeORM Implementation (SQL Database)

**Best for:** Production applications with relational database requirements

**Prerequisites:**
```bash
npm install @nestjs/typeorm typeorm pg
```

**Entity:**
```typescript
// src/infrastructure/entities/summation-transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('summation_transactions')
export class SummationTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('timestamp')
  date: Date;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  category?: string;
}
```

**Repository:**
```typescript
// src/infrastructure/repositories/typeorm-summation.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ISummationRepository, ISummationTransaction } from '../../core';
import { SummationTransactionEntity } from '../entities/summation-transaction.entity';

@Injectable()
export class TypeOrmSummationRepository implements ISummationRepository {
  constructor(
    @InjectRepository(SummationTransactionEntity)
    private readonly repository: Repository<SummationTransactionEntity>,
  ) {}

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ISummationTransaction[]> {
    return this.repository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async findAll(): Promise<ISummationTransaction[]> {
    return this.repository.find({
      order: { date: 'ASC' },
    });
  }
}
```

**Module Configuration:**
```typescript
// src/infrastructure/infrastructure.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummationTransactionEntity } from './entities/summation-transaction.entity';
import { TypeOrmSummationRepository } from './repositories/typeorm-summation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SummationTransactionEntity]),
  ],
  providers: [
    {
      provide: 'ISummationRepository',
      useClass: TypeOrmSummationRepository,
    },
  ],
  exports: ['ISummationRepository'],
})
export class InfrastructureModule {}
```

**Pros:**
- ✅ Production-ready
- ✅ ACID transactions
- ✅ Advanced querying capabilities
- ✅ Concurrent access handling

**Cons:**
- ❌ Requires database setup
- ❌ More complex configuration

---

#### Strategy 4: Prisma Implementation (Modern ORM)

**Best for:** Modern applications preferring type-safe database access

**Prerequisites:**
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**Prisma Schema:**
```prisma
// prisma/schema.prisma
model SummationTransaction {
  id          String   @id @default(uuid())
  amount      Decimal  @db.Decimal(10, 2)
  date        DateTime
  description String?
  category    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("summation_transactions")
}
```

**Repository:**
```typescript
// src/infrastructure/repositories/prisma-summation.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISummationRepository, ISummationTransaction } from '../../core';

@Injectable()
export class PrismaSummationRepository implements ISummationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ISummationTransaction[]> {
    const transactions = await this.prisma.summationTransaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    return transactions.map((t) => ({
      amount: Number(t.amount),
      date: t.date,
    }));
  }

  async findAll(): Promise<ISummationTransaction[]> {
    const transactions = await this.prisma.summationTransaction.findMany({
      orderBy: { date: 'asc' },
    });

    return transactions.map((t) => ({
      amount: Number(t.amount),
      date: t.date,
    }));
  }
}
```

**Pros:**
- ✅ Type-safe database access
- ✅ Auto-generated types
- ✅ Excellent developer experience
- ✅ Database migrations built-in

**Cons:**
- ❌ Additional build step
- ❌ Learning curve for Prisma-specific syntax

---

### Switching Between Implementations

The beauty of the repository pattern is that you can easily switch implementations by changing the provider in `infrastructure.module.ts`:

```typescript
// Switch from Mock to JSON
{
  provide: 'ISummationRepository',
  useClass: JsonSummationRepository,  // Change this line
}

// Switch to TypeORM
{
  provide: 'ISummationRepository',
  useClass: TypeOrmSummationRepository,  // Or this
}
```

**No changes needed in:**
- ✅ Core layer (interfaces remain the same)
- ✅ Application layer (services work unchanged)
- ✅ Controllers (no modifications required)

### Best Practices for Implementation

1. **Keep the interface minimal** - Only add methods that the application layer actually needs
2. **Use domain types** - Return `ISummationTransaction`, not database entities
3. **Handle dates carefully** - Ensure dates are properly converted from strings (JSON) or database types
4. **Add error handling** - Throw meaningful errors for not found, validation failures, etc.
5. **Consider pagination** - For large datasets, add pagination support to `findByDateRange`
6. **Maintain consistency** - All implementations should behave identically from the caller's perspective

### Testing Your Implementation

```typescript
// Example test for any ISummationRepository implementation
describe('SummationRepository', () => {
  let repository: ISummationRepository;

  beforeEach(() => {
    // Initialize your repository (Mock, JSON, TypeORM, etc.)
    repository = new MockSummationRepository();
  });

  it('should find transactions by date range', async () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    const transactions = await repository.findByDateRange(startDate, endDate);

    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
    transactions.forEach((t) => {
      expect(t.date >= startDate && t.date <= endDate).toBe(true);
    });
  });

  it('should return all transactions', async () => {
    const transactions = await repository.findAll();

    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
  });
});
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
│   │   ├── summation-transaction.interface.ts
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
