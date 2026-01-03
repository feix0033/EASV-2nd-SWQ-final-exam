# Synopsis Plan - Fei's Section

**Project**: Financial Advisor Testing Project
**Exam Topic**: Testing in a non-.NET language (Narrow Topic #7)
**Author**: Fei
**Date**: January 3, 2026

**Exam Requirements Checklist**:
- ✅ Testing in non-.NET language (TypeScript/Node.js)
- ✅ Unit testing (Jest framework)
- ✅ Data-driven unit testing (Jest `test.each()`)
- ✅ Mocking framework (Jest mocking capabilities)
- ✅ White-box test techniques (optional - coverage analysis, cyclomatic complexity)

---

## Document Overview

This document outlines the detailed plan for writing my portion of the synopsis. The synopsis follows the template structure:

1. Introduction / Motivation
2. Problem Statement (completed by team)
3. Methodology
4. Analysis & Results
5. Conclusion

---

## 1. Introduction / Motivation (1-1.5 pages)

### 1.1 Why This Topic?

**Personal Motivation**:
- Interest in exploring testing practices outside the .NET ecosystem
- TypeScript/Node.js is widely used in modern web development
- Opportunity to apply course theory to a different technology stack
- Real-world relevance: Financial tracking is a common application domain

**Technical Interest**:
- Nest.js framework mirrors many .NET/ASP.NET Core patterns
- Enables comparison of testing approaches across platforms
- Jest testing framework offers rich features for comprehensive testing
- Clean architecture principles are language-agnostic

### 1.2 Context and Background

**Technology Choice Rationale**:
- TypeScript provides type safety similar to C#
- Nest.js uses dependency injection and modular architecture (familiar from .NET)
- Jest is the industry standard for JavaScript/TypeScript testing
- Large ecosystem and community support

**Application Domain**:
- Personal finance management is relatable and well-understood
- Clear business logic suitable for demonstrating testing techniques
- Sufficient complexity to showcase different testing approaches
- Realistic scenarios for edge cases and boundary testing

### 1.3 Learning Objectives

What I aim to demonstrate through this project:
1. Applying design principles for testability in TypeScript/Node.js
2. Implementing comprehensive unit testing with Jest
3. Using data-driven testing for thorough coverage
4. Leveraging mocking frameworks for test isolation
5. Applying white-box testing techniques (coverage analysis, complexity metrics)

**Connection to Course Material**:
- SWQ 1.3 Lecture: Design for Testability (Week 38)
- SWQ 1.3 Lecture: Unit Test Design Principles (Week 38)
- SWQ 1.2 Lecture: Data-driven Testing (Week 37)
- SWQ 1.10-1.11 Lectures: White-box Testing Techniques (Week 46-47)

---

## 2. Methodology (2-3 pages)

### 2.1 Development Approach

**Architecture Pattern**: Clean Architecture (Hexagonal Architecture)

**Why Clean Architecture?**
- Separates business logic from infrastructure concerns
- Enables easy testing through dependency inversion
- Aligns with course teachings on design for testability
- Makes components independently testable

**Reference**:
- Course material: SWQ 1.3 Lecture - Design for Testability
- Book: Robert C. Martin - Clean Architecture

**Architecture Layers**:
```
Core Layer (Domain)
├── Interfaces (ISummationRepository)
└── Domain Models (Transaction, SummationResult)

Application Layer
├── Services (SummationService - business logic)
├── Controllers (SummationController - HTTP handling)
└── DTOs (Data Transfer Objects)

Infrastructure Layer
├── Repositories (MockSummationRepository)
└── Storage (JsonStorage - file I/O)
```

**Dependency Direction**: Infrastructure → Application → Core (dependencies point inward)

### 2.2 SOLID Principles Implementation

**Dependency Inversion Principle (DIP)**:
- Define `ISummationRepository` interface in core layer
- Implement concrete repositories in infrastructure layer
- Services depend on abstractions, not implementations
- **Benefit for testing**: Easy to inject mock repositories

**Code Example**:
```typescript
// Core layer - abstraction
export interface ISummationRepository {
  findByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]>;
}

// Service depends on interface
export class SummationService {
  constructor(
    @Inject('ISummationRepository')
    private repository: ISummationRepository
  ) {}
}

// Test injects mock
const mockRepo = { findByPeriod: jest.fn() };
const service = new SummationService(mockRepo);
```

**Single Responsibility Principle (SRP)**:
- Each class has one reason to change
- `SummationService`: Only calculation logic
- `SummationController`: Only HTTP request/response
- `JsonStorage`: Only file operations

**Other SOLID Principles**:
- Open/Closed: Extensible through interfaces
- Liskov Substitution: Repositories are interchangeable
- Interface Segregation: Small, focused interfaces

**Reference**: Course material on SOLID principles (Week 38)

### 2.3 Testing Strategy

**Testing Framework**: Jest 29.7.0

**Why Jest?**
- Industry standard for JavaScript/TypeScript
- Built-in mocking capabilities
- Code coverage reporting (Istanbul)
- Rich assertion library
- Excellent TypeScript support

**Jest vs xUnit.net Comparison** (course uses xUnit):
| Feature | xUnit.net (C#) | Jest (TypeScript) |
|---------|----------------|-------------------|
| Basic Test | `[Fact]` | `it()` or `test()` |
| Parameterized | `[Theory]` with `[InlineData]` | `test.each()` |
| Setup/Teardown | Constructor / `IDisposable` | `beforeEach()` / `afterEach()` |
| Assertions | `Assert.Equal()` | `expect().toBe()` |
| Mocking | Moq library | Built-in `jest.fn()` |

**Learning Transfer**: The principles from course (xUnit/Moq) apply directly to Jest

**Test Types to Implement**:

1. **Unit Tests** (Base of Test Pyramid)
   - Test individual functions/methods in isolation
   - Focus on business logic in SummationService
   - Target: >90% coverage for critical paths
   - Aligns with Test Automation Pyramid (Week 37) - many fast unit tests

2. **Data-Driven Tests**
   - Use `test.each()` for parameterized testing
   - Test multiple input scenarios with one test structure
   - Reduce code duplication

3. **Mocking**
   - Mock repository to isolate service tests
   - Mock service to isolate controller tests
   - Verify both behavior (mock) and state (stub)

4. **White-Box Techniques**
   - Branch coverage analysis
   - Path coverage for complex functions
   - Cyclomatic complexity measurement
   - Statement coverage reporting

**Note**: Following Test Automation Pyramid from course (Week 37):
- Emphasis on **many unit tests** (fast, isolated, cheap)
- Controller tests verify integration points
- Not implementing E2E tests for this exam (would be top of pyramid)

### 2.4 Measurement Criteria

**Quantitative Metrics**:
- Test coverage percentage (statement, branch, function, line)
- Number of test cases written
- Cyclomatic complexity per function
- Test execution time

**Qualitative Assessment**:
- Application of design principles (SOLID, Clean Architecture)
- Test quality (clear, maintainable, independent)
- Adherence to unit test design principles
- Effective use of mocking

**Success Criteria**:
- ✅ >80% overall test coverage
- ✅ >90% coverage for business logic (SummationService)
- ✅ All critical paths tested
- ✅ Data-driven tests implemented
- ✅ Mocking framework used effectively
- ✅ White-box analysis documented

### 2.5 References for Methodology

**Course Materials**:
- SWQ 1.2 Lecture: Agile Testing (Data-driven testing)
- SWQ 1.3 Lecture: Design for Testability and Unit Test Design
- SWQ 1.10-1.11 Lectures: Path Testing and Cyclomatic Complexity

**External Resources**:
- Jest Documentation: https://jestjs.io/
- Nest.js Testing Guide: https://docs.nestjs.com/fundamentals/testing
- Martin Fowler: Mocks Aren't Stubs
- Robert C. Martin: Clean Architecture

---

## 3. Analysis & Results (8-10 pages)

*This is the main section - "the meat of the synopsis"*

### 3.1 Design for Testability (2-3 pages)

#### 3.1.1 Clean Architecture Implementation

**Project Structure Analysis**:
```
financial-advisor-nest-js/
├── src/
│   ├── core/                      # Domain layer
│   │   ├── domain/
│   │   │   └── summation-transaction.interface.ts
│   │   └── repositories/
│   │       └── summation-repository.interface.ts
│   ├── application/               # Application layer
│   │   └── summation/
│   │       ├── dto/
│   │       ├── enums/
│   │       ├── summation.controller.ts
│   │       └── summation.service.ts
│   └── infrastructure/            # Infrastructure layer
│       ├── repositories/
│       │   └── mock-summation.repository.ts
│       └── storage/
│           └── json-storage.ts
```

**Dependency Analysis Diagram**:
[Include diagram showing dependency direction: Infrastructure → Application → Core]

**Benefits for Testing**:
- Core layer has no dependencies → Pure business logic, easy to test
- Application layer depends only on core interfaces → Easy to mock
- Infrastructure layer is replaceable → Can use mocks instead of real DB/files

**Code Example - Interface in Core**:
```typescript
// src/core/repositories/summation-repository.interface.ts
export interface ISummationRepository {
  findByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<SummationTransaction[]>;
}
```

**Code Example - Service Depends on Interface**:
```typescript
// src/application/summation/summation.service.ts
export class SummationService {
  constructor(
    @Inject('ISummationRepository')
    private readonly repository: ISummationRepository
  ) {}

  async calculateTotal(period: Period): Promise<number> {
    const { startDate, endDate } = this.getPeriodRange(period);
    const transactions = await this.repository.findByPeriod(startDate, endDate);
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }
}
```

**Analysis**:
- Service depends on `ISummationRepository` interface, not concrete implementation
- In production: inject `MockSummationRepository` or `DatabaseRepository`
- In tests: inject mock/stub with controlled behavior
- Demonstrates Dependency Inversion Principle

#### 3.1.2 Dependency Injection with Nest.js

**Module Configuration**:
```typescript
@Module({
  controllers: [SummationController],
  providers: [
    SummationService,
    {
      provide: 'ISummationRepository',
      useClass: MockSummationRepository, // Production
      // useValue: mockRepo,             // Testing
    },
  ],
})
export class SummationModule {}
```

**Testing Configuration**:
```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    SummationService,
    {
      provide: 'ISummationRepository',
      useValue: mockRepository, // Inject mock for testing
    },
  ],
}).compile();

const service = module.get<SummationService>(SummationService);
```

**Analysis**:
- Nest.js DI container manages dependencies
- Easy to swap implementations for testing
- Aligns with course teaching on DI for testability

#### 3.1.3 Pure Functions and Testability

**Example: Date Range Calculation**:
```typescript
private getPeriodRange(period: Period, customStart?: Date, customEnd?: Date) {
  const now = new Date();

  switch (period) {
    case Period.TODAY:
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
    case Period.THIS_WEEK:
      return {
        startDate: startOfWeek(now),
        endDate: endOfWeek(now),
      };
    // ... more cases
  }
}
```

**Why This is Testable**:
- Deterministic: Same input → same output (except `now`)
- No side effects
- No hidden dependencies
- Clear inputs and outputs

**Testing Challenge**: Time-dependent function
**Solution**: Could inject date provider (advanced) or use Jest fake timers

### 3.2 Unit Testing Implementation (3-4 pages)

#### 3.2.1 Test Structure and Organization

**File Structure**:
```
src/application/summation/
├── summation.service.ts
├── summation.service.spec.ts    # Unit tests
└── summation.controller.spec.ts # Controller tests
```

**Naming Convention**: `*.spec.ts` for unit tests (Jest convention)

#### 3.2.2 Basic Unit Test Example

**Test Suite Setup**:
```typescript
describe('SummationService', () => {
  let service: SummationService;
  let mockRepository: jest.Mocked<ISummationRepository>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      findByPeriod: jest.fn(),
    };

    // Create service instance with mock
    service = new SummationService(mockRepository);
  });

  // Tests go here
});
```

**Test Case Example**:
```typescript
describe('calculateTotal', () => {
  it('should return 0 when there are no transactions', async () => {
    // Arrange
    mockRepository.findByPeriod.mockResolvedValue([]);

    // Act
    const result = await service.calculateTotal(Period.TODAY);

    // Assert
    expect(result).toBe(0);
  });

  it('should sum all transaction amounts correctly', async () => {
    // Arrange
    const mockTransactions = [
      { amount: 100, date: new Date(), category: 'Income' },
      { amount: -50, date: new Date(), category: 'Expense' },
      { amount: 200, date: new Date(), category: 'Income' },
    ];
    mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

    // Act
    const result = await service.calculateTotal(Period.TODAY);

    // Assert
    expect(result).toBe(250); // 100 - 50 + 200
  });
});
```

**Analysis - Unit Test Design Principles Applied** (from course Week 38):

1. **Fast**: Tests run in <100ms (no real DB/file I/O)
2. **Independent/Isolated**: Each test can run alone (beforeEach resets state)
3. **Repeatable**: Mock returns consistent data
4. **Self-validating**: Clear assertions (expect)
5. **Single Reason to Fail**: Each test focuses on one behavior
6. **Easy to Write**: Simple arrange-act-assert structure
7. **Easy to Read**: Descriptive test names and clear code
8. **Easy to Change/Maintain**: Mocking makes tests resilient to infrastructure changes

**Arrange-Act-Assert Pattern**:
- **Arrange**: Set up mock data and expectations
- **Act**: Call the method under test
- **Assert**: Verify the result

#### 3.2.3 Testing Different Calculation Methods

**Income Calculation Test**:
```typescript
describe('calculateIncome', () => {
  it('should sum only positive amounts', async () => {
    // Arrange
    const mockTransactions = [
      { amount: 100, date: new Date(), category: 'Salary' },
      { amount: -50, date: new Date(), category: 'Food' },
      { amount: 200, date: new Date(), category: 'Bonus' },
      { amount: -30, date: new Date(), category: 'Transport' },
    ];
    mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

    // Act
    const result = await service.calculateIncome(Period.TODAY);

    // Assert
    expect(result).toBe(300); // 100 + 200 (only positive)
  });

  it('should return 0 when there is no income', async () => {
    // Arrange
    const mockTransactions = [
      { amount: -50, date: new Date(), category: 'Food' },
      { amount: -30, date: new Date(), category: 'Transport' },
    ];
    mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

    // Act
    const result = await service.calculateIncome(Period.TODAY);

    // Assert
    expect(result).toBe(0);
  });
});
```

**Expense Calculation Test**:
```typescript
describe('calculateExpenses', () => {
  it('should sum only negative amounts', async () => {
    // Arrange
    const mockTransactions = [
      { amount: 100, date: new Date(), category: 'Salary' },
      { amount: -50, date: new Date(), category: 'Food' },
      { amount: -30, date: new Date(), category: 'Transport' },
    ];
    mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

    // Act
    const result = await service.calculateExpenses(Period.TODAY);

    // Assert
    expect(result).toBe(-80); // -50 + -30 (only negative)
  });
});
```

**Coverage Analysis**:
- Each public method has dedicated test suite
- Edge cases covered (empty arrays, all positive, all negative)
- Normal cases covered (mixed transactions)

#### 3.2.4 Test Coverage Report

**Before Implementation**:
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
summation.service.ts  |   6.81  |    0.00  |   0.00  |   6.81  |
```

**After Basic Unit Tests**:
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
summation.service.ts  |  [X%]   |   [X%]   |  [X%]   |  [X%]   |
```

[Include actual coverage report screenshot after implementation]

### 3.3 Data-Driven Testing (2-3 pages)

#### 3.3.1 Why Data-Driven Testing?

**Problem**: Repeating similar test code
```typescript
// Without data-driven testing - repetitive!
it('should calculate TODAY period correctly', () => { /* ... */ });
it('should calculate YESTERDAY period correctly', () => { /* ... */ });
it('should calculate THIS_WEEK period correctly', () => { /* ... */ });
it('should calculate THIS_MONTH period correctly', () => { /* ... */ });
// ... 8 more similar tests
```

**Solution**: Use `test.each()` for parameterized tests
- Reduce code duplication
- Easy to add new test cases
- Clear documentation of tested scenarios

**Reference**: Course material on data-driven testing (Week 37)

#### 3.3.2 Period Calculation Tests

**Implementation with test.each()**:
```typescript
describe('Period Range Calculations', () => {
  test.each([
    {
      period: Period.TODAY,
      expectedStart: startOfDay(new Date()),
      expectedEnd: endOfDay(new Date()),
      description: 'calculate TODAY period correctly',
    },
    {
      period: Period.YESTERDAY,
      expectedStart: startOfDay(subDays(new Date(), 1)),
      expectedEnd: endOfDay(subDays(new Date(), 1)),
      description: 'calculate YESTERDAY period correctly',
    },
    {
      period: Period.THIS_WEEK,
      expectedStart: startOfWeek(new Date()),
      expectedEnd: endOfWeek(new Date()),
      description: 'calculate THIS_WEEK period correctly',
    },
    {
      period: Period.THIS_MONTH,
      expectedStart: startOfMonth(new Date()),
      expectedEnd: endOfMonth(new Date()),
      description: 'calculate THIS_MONTH period correctly',
    },
    // ... more test cases
  ])('should $description', async ({ period, expectedStart, expectedEnd }) => {
    // Arrange
    mockRepository.findByPeriod.mockResolvedValue([]);

    // Act
    await service.calculateTotal(period);

    // Assert
    expect(mockRepository.findByPeriod).toHaveBeenCalledWith(
      expectedStart,
      expectedEnd
    );
  });
});
```

**Analysis**:
- Single test implementation for 8+ scenarios
- Each row in the array becomes a separate test case
- Jest generates descriptive test names automatically
- Easy to add new periods (e.g., LAST_YEAR)

**Benefits**:
- **Maintainability**: One implementation to maintain
- **Comprehensiveness**: Easy to ensure all periods are tested
- **Documentation**: Table format clearly shows all cases
- **DRY Principle**: Don't Repeat Yourself

#### 3.3.3 Income/Expense Calculation Tests

**Test Data Table**:
```typescript
describe('Income and Expense Calculations', () => {
  test.each([
    {
      scenario: 'mixed income and expenses',
      transactions: [
        { amount: 100, category: 'Salary' },
        { amount: -50, category: 'Food' },
        { amount: 200, category: 'Bonus' },
        { amount: -30, category: 'Transport' },
      ],
      expectedTotal: 220,
      expectedIncome: 300,
      expectedExpenses: -80,
    },
    {
      scenario: 'only income',
      transactions: [
        { amount: 100, category: 'Salary' },
        { amount: 200, category: 'Bonus' },
      ],
      expectedTotal: 300,
      expectedIncome: 300,
      expectedExpenses: 0,
    },
    {
      scenario: 'only expenses',
      transactions: [
        { amount: -50, category: 'Food' },
        { amount: -30, category: 'Transport' },
      ],
      expectedTotal: -80,
      expectedIncome: 0,
      expectedExpenses: -80,
    },
    {
      scenario: 'empty transactions',
      transactions: [],
      expectedTotal: 0,
      expectedIncome: 0,
      expectedExpenses: 0,
    },
  ])(
    'should correctly calculate $scenario',
    async ({ transactions, expectedTotal, expectedIncome, expectedExpenses }) => {
      // Arrange
      mockRepository.findByPeriod.mockResolvedValue(transactions);

      // Act
      const total = await service.calculateTotal(Period.TODAY);
      const income = await service.calculateIncome(Period.TODAY);
      const expenses = await service.calculateExpenses(Period.TODAY);

      // Assert
      expect(total).toBe(expectedTotal);
      expect(income).toBe(expectedIncome);
      expect(expenses).toBe(expectedExpenses);
    }
  );
});
```

**Analysis**:
- Tests multiple calculation methods with same data set
- Covers edge cases: empty, all positive, all negative, mixed
- Clear documentation of expected behavior for each scenario

**Test Output Example**:
```
✓ should correctly calculate mixed income and expenses (5ms)
✓ should correctly calculate only income (3ms)
✓ should correctly calculate only expenses (3ms)
✓ should correctly calculate empty transactions (2ms)
```

#### 3.3.4 Boundary Value Testing with Data-Driven Tests

**Testing Edge Cases**:
```typescript
describe('Boundary Value Tests', () => {
  test.each([
    { amount: 0, expectedIncome: 0, expectedExpenses: 0, case: 'zero amount' },
    { amount: 0.01, expectedIncome: 0.01, expectedExpenses: 0, case: 'smallest positive' },
    { amount: -0.01, expectedIncome: 0, expectedExpenses: -0.01, case: 'smallest negative' },
    { amount: Number.MAX_SAFE_INTEGER, expectedIncome: Number.MAX_SAFE_INTEGER, expectedExpenses: 0, case: 'maximum safe integer' },
    { amount: Number.MIN_SAFE_INTEGER, expectedIncome: 0, expectedExpenses: Number.MIN_SAFE_INTEGER, case: 'minimum safe integer' },
  ])(
    'should handle $case correctly',
    async ({ amount, expectedIncome, expectedExpenses }) => {
      // Arrange
      mockRepository.findByPeriod.mockResolvedValue([{ amount, date: new Date(), category: 'Test' }]);

      // Act
      const income = await service.calculateIncome(Period.TODAY);
      const expenses = await service.calculateExpenses(Period.TODAY);

      // Assert
      expect(income).toBe(expectedIncome);
      expect(expenses).toBe(expectedExpenses);
    }
  );
});
```

**Connection to Course Material**:
- Boundary Value Testing (Week 41)
- Testing at boundaries between equivalence classes
- Zero is boundary between positive and negative
- Extreme values test robustness

### 3.4 Mocking Framework Usage (2-3 pages)

#### 3.4.1 Mock vs Stub vs Fake

**Definitions** (from course material):

- **Mock**: Verifies **behavior** (method calls, parameters)
- **Stub**: Returns **predefined data** for state verification
- **Fake**: Simplified working implementation

**Mock Example - Behavior Verification**:
```typescript
it('should call repository with correct date range', async () => {
  // Arrange
  const expectedStart = startOfDay(new Date());
  const expectedEnd = endOfDay(new Date());
  mockRepository.findByPeriod.mockResolvedValue([]);

  // Act
  await service.calculateTotal(Period.TODAY);

  // Assert - VERIFY THE CALL (behavior)
  expect(mockRepository.findByPeriod).toHaveBeenCalledTimes(1);
  expect(mockRepository.findByPeriod).toHaveBeenCalledWith(
    expectedStart,
    expectedEnd
  );
});
```

**Analysis**:
- Testing that service correctly calls repository
- Verifying method was called with right parameters
- This is a **mock** - we care about the interaction

**Stub Example - State Verification**:
```typescript
it('should calculate correct total from stub data', async () => {
  // Arrange - STUB RETURNS PREDEFINED DATA
  mockRepository.findByPeriod.mockResolvedValue([
    { amount: 100, date: new Date(), category: 'Income' },
    { amount: -50, date: new Date(), category: 'Expense' },
  ]);

  // Act
  const result = await service.calculateTotal(Period.TODAY);

  // Assert - VERIFY THE RESULT (state)
  expect(result).toBe(50);
});
```

**Analysis**:
- Stub provides controlled test data
- We care about the **result**, not the call
- This is a **stub** - we care about state/output

#### 3.4.2 Jest Mocking Capabilities

**Creating Mocks** (compared to Moq from course):
```typescript
// Manual mock object (similar to Moq's Mock<T>)
const mockRepository = {
  findByPeriod: jest.fn(),
};

// Mock implementation (similar to Moq's .Setup())
mockRepository.findByPeriod.mockResolvedValue([/* data */]);

// Mock rejection (for error testing)
mockRepository.findByPeriod.mockRejectedValue(new Error('Database error'));
```

**Moq (C# - from course) vs Jest (TypeScript) Comparison**:
```csharp
// Moq - Setup and Verify
var mockRepo = new Mock<IRepository>();
mockRepo.Setup(r => r.FindByPeriod(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
        .ReturnsAsync(transactions);
mockRepo.Verify(r => r.FindByPeriod(...), Times.Once());
```

```typescript
// Jest - Equivalent functionality
const mockRepo = { findByPeriod: jest.fn() };
mockRepo.findByPeriod.mockResolvedValue(transactions);
expect(mockRepo.findByPeriod).toHaveBeenCalledTimes(1);
```

**Argument Matchers** (Jest vs Moq):
```typescript
// Exact match
expect(mockRepo.findByPeriod).toHaveBeenCalledWith(
  new Date('2026-01-01'),
  new Date('2026-01-31')
);

// Any value of type (similar to Moq's It.IsAny<T>())
expect(mockRepo.findByPeriod).toHaveBeenCalledWith(
  expect.any(Date),  // Like It.IsAny<DateTime>()
  expect.any(Date)
);

// Custom matcher (similar to Moq's It.Is<T>(predicate))
expect(mockRepo.findByPeriod).toHaveBeenCalledWith(
  expect.objectContaining({ year: 2026 }),
  expect.any(Date)
);
```

**Learning Transfer**: Moq's `It.IsAny<T>()` ≈ Jest's `expect.any(Type)`

#### 3.4.3 Testing Error Handling with Mocks

**Repository Error Scenario**:
```typescript
it('should handle repository errors gracefully', async () => {
  // Arrange - mock throws error
  const error = new Error('Database connection failed');
  mockRepository.findByPeriod.mockRejectedValue(error);

  // Act & Assert
  await expect(
    service.calculateTotal(Period.TODAY)
  ).rejects.toThrow('Database connection failed');
});
```

**Analysis**:
- Mocking enables testing error scenarios
- No need for real database to fail
- Tests remain fast and deterministic

#### 3.4.4 Controller Testing with Mocked Service

**Controller Test Example**:
```typescript
describe('SummationController', () => {
  let controller: SummationController;
  let mockService: jest.Mocked<SummationService>;

  beforeEach(async () => {
    // Create mock service
    mockService = {
      calculateTotal: jest.fn(),
      calculateIncome: jest.fn(),
      calculateExpenses: jest.fn(),
    } as any;

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummationController],
      providers: [
        {
          provide: SummationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SummationController>(SummationController);
  });

  describe('GET /summation', () => {
    it('should return total summation', async () => {
      // Arrange
      const mockResult = 1000;
      mockService.calculateTotal.mockResolvedValue(mockResult);

      // Act
      const result = await controller.getTotal({ period: Period.TODAY });

      // Assert
      expect(result).toBe(mockResult);
      expect(mockService.calculateTotal).toHaveBeenCalledWith(Period.TODAY);
    });
  });
});
```

**Analysis**:
- Controller tests are isolated from service implementation
- Service is mocked - we test only controller logic
- Fast tests (no real service instantiation)
- Demonstrates proper layer isolation

**Benefits of Mocking**:
1. **Isolation**: Test one component at a time
2. **Speed**: No real I/O operations
3. **Control**: Simulate any scenario (errors, edge cases)
4. **Determinism**: Consistent test results

### 3.5 White-Box Testing Techniques (3-4 pages)

#### 3.5.1 Control Flow Analysis

**Function Under Analysis**: `getPeriodRange()`

**Source Code**:
```typescript
private getPeriodRange(period: Period, customStart?: Date, customEnd?: Date) {
  if (period === Period.CUSTOM) {                    // Decision 1
    if (!customStart || !customEnd) {                // Decision 2
      throw new Error('Custom period requires start and end dates');
    }
    return { startDate: customStart, endDate: customEnd };
  }

  const now = new Date();

  if (period === Period.TODAY) {                     // Decision 3
    return { startDate: startOfDay(now), endDate: endOfDay(now) };
  } else if (period === Period.YESTERDAY) {          // Decision 4
    const yesterday = subDays(now, 1);
    return { startDate: startOfDay(yesterday), endDate: endOfDay(yesterday) };
  } else if (period === Period.THIS_WEEK) {          // Decision 5
    return { startDate: startOfWeek(now), endDate: endOfWeek(now) };
  } else if (period === Period.THIS_MONTH) {         // Decision 6
    return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
  }
  // ... more branches
}
```

**Program Graph**:
[Draw flowchart showing]:
- Entry node
- Decision nodes (diamonds): period === CUSTOM, customStart/End check, each period check
- Process nodes (rectangles): date calculations
- Exit nodes: return statements

**DD-Path Graph** (Decision-to-Decision Path):
[Simplified graph showing]:
- Node 1: Entry → Decision 1 (CUSTOM check)
- Node 2: Decision 2 (start/end check) → Error or Return
- Node 3: Decision 3-6 (period checks) → Return
- Edges showing flow between decisions

**Reference**: Course lectures on Path Testing (Week 46)

#### 3.5.2 Coverage Criteria

**Branch Coverage Analysis**:

Branches to cover in `getPeriodRange()`:
1. `period === CUSTOM` → True / False
2. `!customStart || !customEnd` → True / False (when CUSTOM)
3. `period === TODAY` → True / False
4. `period === YESTERDAY` → True / False
5. `period === THIS_WEEK` → True / False
6. ... (8+ branches total)

**Test Cases for 100% Branch Coverage**:
```typescript
describe('Branch Coverage Tests', () => {
  it('covers CUSTOM with valid dates branch', () => {
    // Tests: period === CUSTOM (TRUE), customStart/End exist (TRUE path)
    const result = service.getPeriodRange(
      Period.CUSTOM,
      new Date('2026-01-01'),
      new Date('2026-01-31')
    );
    expect(result.startDate).toEqual(new Date('2026-01-01'));
  });

  it('covers CUSTOM with missing dates branch', () => {
    // Tests: period === CUSTOM (TRUE), customStart/End missing (FALSE path)
    expect(() => {
      service.getPeriodRange(Period.CUSTOM);
    }).toThrow('Custom period requires start and end dates');
  });

  it('covers TODAY branch', () => {
    // Tests: period === CUSTOM (FALSE), period === TODAY (TRUE)
    const result = service.getPeriodRange(Period.TODAY);
    expect(result.startDate).toEqual(startOfDay(new Date()));
  });

  it('covers YESTERDAY branch', () => {
    // Tests: CUSTOM (FALSE), TODAY (FALSE), YESTERDAY (TRUE)
    const result = service.getPeriodRange(Period.YESTERDAY);
    // assertions
  });

  // ... more tests for each branch
});
```

**Coverage Report**:
```
File: summation.service.ts
Branch Coverage: [X]% ([Y]/[Z] branches covered)

Uncovered branches:
- Line X: else branch for [condition]
```

[Include screenshot of actual coverage report]

**Statement Coverage**:
- Goal: Execute every statement at least once
- Current: [X]%
- Target: >90% for critical business logic

**Path Coverage**:
- Total possible paths: 2^(number of decisions) = potentially hundreds
- **Not feasible** to test all paths
- Focus on **critical paths** and **edge cases**

**Note on Compound Conditions**:
For the compound condition `!customStart || !customEnd` (Decision 2):
- Could apply MC/DC (Modified Condition/Decision Coverage) from course material (Week 47)
- MC/DC ensures each condition independently affects the outcome
- Test cases: (1) both missing, (2) only start missing, (3) only end missing, (4) both present
- This demonstrates thorough testing of the compound Boolean expression

#### 3.5.3 Cyclomatic Complexity

**Calculating Complexity for `getPeriodRange()`**:

**Formula**: V(G) = E - N + 2P
- E = Edges in program graph
- N = Nodes in program graph
- P = Connected components (1 for single function)

**Alternative Formula**: V(G) = D + 1
- D = Number of decision points
- Easier to count from source code

**Counting Decisions**:
```typescript
private getPeriodRange(period: Period, customStart?: Date, customEnd?: Date) {
  if (period === Period.CUSTOM) {           // Decision 1
    if (!customStart || !customEnd) {       // Decision 2 (Note: compound with || operator)
      throw new Error('...');
    }
    return { ... };
  }

  const now = new Date();

  if (period === Period.TODAY) {            // Decision 3
    return { ... };
  } else if (period === Period.YESTERDAY) { // Decision 4
    return { ... };
  } else if (period === Period.THIS_WEEK) { // Decision 5
    return { ... };
  } else if (period === Period.THIS_MONTH) {// Decision 6
    return { ... };
  } else if (period === Period.LAST_WEEK) { // Decision 7
    return { ... };
  } else if (period === Period.LAST_MONTH) {// Decision 8
    return { ... };
  }

  throw new Error('Invalid period');
}

// Total decision points: 8
// For V(G) = D + 1 formula, we count decision points (if/else if statements)
// The compound condition (!customStart || !customEnd) counts as 1 decision point
// V(G) = 8 + 1 = 9
```

**Complexity Interpretation** (from course material):
- V(G) = 1-10: **Simple**, low risk
- V(G) = 11-20: Moderate, medium risk
- V(G) = 21-50: Complex, high risk
- V(G) > 50: Very complex, very high risk

**Analysis**:
- V(G) = 9: **Simple to moderate complexity**
- Acceptable for a period calculation function
- Minimum 9 test cases needed for path coverage
- Could be refactored to reduce complexity (strategy pattern)

**Comparison Across Functions**:
```
Function                    | Complexity | Interpretation
----------------------------|------------|---------------
calculateTotal()            |     3      | Very simple
calculateIncome()           |     4      | Simple
calculateExpenses()         |     4      | Simple
getPeriodRange()            |     9      | Moderate
filterByCategory()          |     5      | Simple
```

**Tool Support**:
- ESLint plugin: eslint-plugin-complexity
- Code metrics tools: complexity-report
- Jest coverage includes complexity in some reporters

[Include screenshot of complexity metrics output]

**Minimum Test Cases Required**:
- For `getPeriodRange()`: 9 test cases (one per independent path)
- Our data-driven tests cover all 8 period types + error case ✓

#### 3.5.4 Coverage Reports

**Jest Coverage Configuration**:
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Running Coverage**:
```bash
npm run test:cov
```

**Coverage Report Output**:
```
------------------------|---------|----------|---------|---------|
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
All files               |   [X]   |   [X]    |   [X]   |   [X]   |
 summation.service.ts   |   [X]   |   [X]    |   [X]   |   [X]   |
 summation.controller.ts|   [X]   |   [X]    |   [X]   |   [X]   |
------------------------|---------|----------|---------|---------|
```

[Include actual HTML coverage report screenshots showing]:
- Overall coverage summary
- File-by-file breakdown
- Highlighted code showing covered (green) vs uncovered (red) lines

**Before/After Comparison**:
[Side-by-side screenshots or table showing improvement from initial 45% to final coverage]

---

## 4. Conclusion (1-1.5 pages)

### 4.1 Summary of Work

**What Was Accomplished**:

1. **Designed a testable architecture**:
   - Implemented Clean Architecture with clear separation of concerns
   - Applied SOLID principles, especially Dependency Inversion
   - Used dependency injection for easy test isolation

2. **Comprehensive unit testing**:
   - Created test suites for all business logic
   - Achieved [X]% test coverage overall
   - [X]% coverage for critical SummationService

3. **Data-driven testing**:
   - Implemented parameterized tests with Jest `test.each()`
   - Reduced code duplication significantly
   - Covered multiple scenarios efficiently

4. **Effective use of mocking**:
   - Isolated components using Jest mocks
   - Distinguished between mocks (behavior) and stubs (state)
   - Tested error scenarios through mock rejections

5. **White-box analysis**:
   - Created control flow diagrams for complex functions
   - Analyzed branch and statement coverage
   - Calculated cyclomatic complexity
   - Achieved comprehensive coverage of critical paths

### 4.2 Key Learnings

**Technical Insights**:
- TypeScript/Jest testing ecosystem is mature and powerful
- Dependency injection is crucial for testability across all platforms
- Data-driven testing significantly improves test efficiency
- White-box techniques reveal coverage gaps not obvious from black-box testing

**Design Insights**:
- Clean Architecture principles are language-agnostic
- SOLID principles directly improve testability
- Pure functions are easiest to test
- Time-dependent code requires special handling

**Testing Insights**:
- Aim for >80% coverage but focus on critical paths
- Data-driven tests make comprehensive testing practical
- Mocking enables fast, isolated, deterministic tests
- Coverage metrics guide but don't guarantee quality

### 4.3 Connection to Course Material

**Applied Concepts from Course**:
- ✅ Design for Testability (Week 38)
- ✅ Unit Test Design Principles (Week 38)
- ✅ Data-driven Testing (Week 37)
- ✅ Mocking Frameworks (Week 38)
- ✅ Path Testing (Week 46)
- ✅ Cyclomatic Complexity (Week 47)
- ✅ Coverage Criteria (Week 46)

**Successfully Demonstrated**:
- All required exam criteria for Narrow Topic #7
- Testing in non-.NET language (TypeScript/Node.js)
- Unit testing with Jest framework
- Data-driven unit testing with parameterized tests
- Mocking framework usage for test isolation
- White-box testing techniques

### 4.4 Reflection

**What Worked Well**:
- Clean Architecture made testing straightforward
- Dependency injection simplified mocking
- Data-driven tests covered many scenarios efficiently
- Jest tooling provided excellent developer experience

**Challenges Encountered**:
- Time-dependent functions required careful handling
- Async/await testing needed understanding of Jest matchers
- Achieving 100% coverage required thorough edge case analysis

**Real-World Applicability**:
- These testing practices are directly applicable to production codebases
- The patterns demonstrated scale to larger applications
- Testing discipline improves code quality and maintainability
- Comprehensive tests enable confident refactoring

**Future Improvements**:
- Add integration tests for API endpoints
- Implement E2E tests with Supertest
- Consider mutation testing with Stryker for test quality validation
- Add performance testing for calculation operations with large datasets

---

## References

### Course Materials
- EASV Software Quality Course Materials (Fall 2025)
- SWQ 1.2 Lecture: Agile Testing (Week 37)
- SWQ 1.3 Lecture: Design for Testability and Unit Test Design (Week 38)
- SWQ 1.10 Lecture: Path Testing Part 1 (Week 46)
- SWQ 1.11 Lecture: Path Testing Part 2 (Week 47)

### Technical Documentation
- Jest Documentation. https://jestjs.io/
- Nest.js Testing Guide. https://docs.nestjs.com/fundamentals/testing
- TypeScript Handbook. https://www.typescriptlang.org/docs/

### Books and Articles
- Martin, Robert C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
- Fowler, Martin. "Mocks Aren't Stubs". https://martinfowler.com/articles/mocksArentStubs.html
- Beck, Kent (2002). *Test Driven Development: By Example*. Addison-Wesley.

### Tools and Frameworks
- Jest Testing Framework v29.7.0
- Nest.js Framework v11.0.1
- TypeScript v5.7.3

---

## Appendix (Optional)

### A. Complete Test Coverage Report
[Full HTML coverage report or detailed statistics]

### B. Cyclomatic Complexity Metrics
[Complete complexity analysis for all functions]

### C. Project Structure
[Full directory tree with file descriptions]

### D. Test Execution Logs
[Sample test run output showing all tests passing]

---

**Document Status**: Planning Complete
**Next Steps**:
1. Complete test implementation
2. Generate coverage reports
3. Write actual synopsis based on this plan
4. Review and refine

**Estimated Completion**: January 4, 2026
**Submission Deadline**: January 5, 2026, 12:00
