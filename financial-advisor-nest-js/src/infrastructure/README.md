# Infrastructure Layer

This is the **outermost layer** in the onion architecture. It contains all external dependencies and infrastructure concerns.

## Purpose

- Implements interfaces defined in inner layers (domain/application)
- Handles database access, external APIs, file systems, etc.
- Can be replaced without affecting business logic

## Current Structure

```
infrastructure/
├── repositories/
│   └── mock-summation.repository.ts    # In-memory implementation (for development)
└── infrastructure.module.ts            # Provides repository implementations
```

## Dependency Direction

```
Infrastructure Layer
       │
       │ implements
       ▼
Core Layer (Interfaces)
       ▲
       │ depends on
       │
Application Layer (Services)
```

## Adding New Infrastructure

### Database Implementation (TypeORM Example)

1. **Create entity** in `infrastructure/entities/`:
```typescript
@Entity('transactions')
export class Transaction implements ISummationRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column('timestamp')
  date: Date;
}
```

2. **Create repository** in `infrastructure/repositories/`:
```typescript
@Injectable()
export class TransactionRepository implements ISummationRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async findByDateRange(startDate: Date, endDate: Date) {
    return this.repo.find({
      where: { date: Between(startDate, endDate) },
    });
  }

  async findAll() {
    return this.repo.find();
  }
}
```

3. **Update module**:
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [
    {
      provide: 'ISummationRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: ['ISummationRepository'],
})
export class InfrastructureModule {}
```

## Benefits

- **Swappable**: Change from in-memory → PostgreSQL → MongoDB without touching business logic
- **Testable**: Use mock repository in tests, real repository in production
- **Independent**: Infrastructure changes don't ripple into domain layer
