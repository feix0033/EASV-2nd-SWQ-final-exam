# Summation Service

A decoupled service for calculating financial summations grouped by different time durations (day, week, month, year).

## Architecture

This module follows the **Repository Pattern** and **Dependency Inversion Principle** to decouple business logic from data access.

```
┌─────────────────────┐
│   Controller        │  ← HTTP layer
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Service           │  ← Business logic (grouping, summing)
│   (depends on       │
│   interface only)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  ISummationRepository│  ← Interface (contract)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Repository Impl    │  ← Data access (TypeORM, Prisma, etc.)
│  (Todo: implement)  │
└─────────────────────┘
```

## Directory Structure

```
summation/
├── dto/                          # Data Transfer Objects
│   ├── summation-query.dto.ts    # Input parameters
│   └── summation-result.dto.ts   # Output format
├── enums/
│   └── duration.enum.ts          # Time duration types
├── interfaces/
│   ├── summation-record.interface.ts     # Record contract
│   └── summation-repository.interface.ts # Repository contract
├── repositories/
│   └── mock-summation.repository.ts      # Example implementation
├── summation.controller.ts       # HTTP endpoints
├── summation.service.ts          # Business logic
└── summation.module.ts           # Module configuration
```

## Key Concepts

### 1. Interface-Based Design

The service depends on **interfaces**, not concrete implementations:

```typescript
// Service only knows about the interface
constructor(
  @Inject('ISummationRepository')
  private readonly repository: ISummationRepository,
) {}
```

### 2. Implementation Todos

Todo: Implement the following to complete the data layer:

1. **Create the actual entity/model** (e.g., with TypeORM):
```typescript
@Entity('transactions')
export class Transaction implements ISummationRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column('timestamp')
  date: Date;

  // ... other fields
}
```

2. **Implement the repository interface**:
```typescript
@Injectable()
export class TransactionRepository implements ISummationRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async findByDateRange(startDate: Date, endDate: Date): Promise<ISummationRecord[]> {
    return this.repo.find({
      where: {
        date: Between(startDate, endDate),
      },
    });
  }

  async findAll(): Promise<ISummationRecord[]> {
    return this.repo.find();
  }
}
```

3. **Update the module provider**:
```typescript
{
  provide: 'ISummationRepository',
  useClass: TransactionRepository, // Replace MockSummationRepository
}
```

## Usage

### API Endpoints

#### 1. Get Total Summation (All Records)
```bash
# Default: monthly summation of all data
GET /summation

# With specific duration
GET /summation?duration=week

# Using semantic duration (today, yesterday, lastweek, lastmonth, lastyear)
GET /summation?semanticDuration=today
GET /summation?semanticDuration=lastweek&duration=day
GET /summation?semanticDuration=lastmonth

# Custom date range
GET /summation?startDate=2024-01-01&endDate=2024-12-31&duration=month
```

#### 2. Get Income Summation (Positive Values Only)
```bash
# Monthly income for last month
GET /summation/income?semanticDuration=lastmonth

# Daily income for this week
GET /summation/income?semanticDuration=thisweek&duration=day

# Custom date range
GET /summation/income?startDate=2024-01-01&endDate=2024-12-31
```

#### 3. Get Expenses Summation (Negative Values Only)
```bash
# Monthly expenses for last month
GET /summation/expenses?semanticDuration=lastmonth

# Daily expenses for today
GET /summation/expenses?semanticDuration=today&duration=day

# Custom date range
GET /summation/expenses?startDate=2024-01-01&endDate=2024-12-31
```

### Supported Semantic Durations
- `today` - Current day
- `yesterday` - Previous day
- `thisweek` - Current week (Monday to today)
- `lastweek` - Previous week (Monday to Sunday)
- `thismonth` - Current month (1st to today)
- `lastmonth` - Previous month (full month)
- `thisyear` - Current year (Jan 1st to today)
- `lastyear` - Previous year (full year)

### Supported Grouping Durations
- `day` - Group by day
- `week` - Group by ISO week
- `month` - Group by month (default)
- `year` - Group by year

### Response Format

```json
[
  {
    "period": "2024-01",
    "total": 450,
    "count": 3,
    "startDate": "2024-01-05T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z"
  },
  {
    "period": "2024-02",
    "total": 550,
    "count": 2,
    "startDate": "2024-02-03T00:00:00.000Z",
    "endDate": "2024-02-15T00:00:00.000Z"
  }
]
```

## Benefits of This Design

1. **Decoupling**: Service logic is independent of data storage
2. **Testability**: Easy to mock the repository in tests
3. **Flexibility**: Can swap out data sources (SQL, NoSQL, API, etc.) without changing service logic
4. **Team Collaboration**: Business logic and data layer can be developed independently
5. **Type Safety**: Interfaces ensure contract compliance

## Testing Example

```typescript
describe('SummationService', () => {
  let service: SummationService;
  let mockRepository: ISummationRepository;

  beforeEach(async () => {
    mockRepository = {
      findByDateRange: jest.fn(),
      findAll: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SummationService,
        {
          provide: 'ISummationRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SummationService>(SummationService);
  });

  // ... tests
});
```
