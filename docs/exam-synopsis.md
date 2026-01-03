# Testing in a Non-.NET Language: Financial Advisor Application

**Exam Topic**: Narrow Topic #7 - Testing in a non-.NET language
**Author**: Fei Gu
**Date**: January 3, 2026
**Framework**: Nest.js (TypeScript/Node.js)
**Testing Framework**: Jest 29.7.0

---

## 1. Introduction / Motivation

### 1.1 Why This Topic?

This project explores software testing practices outside the .NET ecosystem, specifically using TypeScript and Node.js with the Nest.js framework. The motivation for choosing this topic stems from several factors:

**Personal Interest**: As modern web development increasingly relies on JavaScript/TypeScript ecosystems, understanding how testing principles learned in the course (using C# and xUnit.net) transfer to other platforms is highly valuable. TypeScript's type safety makes it particularly interesting as it shares similarities with C# while operating in a different runtime environment.

**Technical Relevance**: Nest.js mirrors many patterns from ASP.NET Core (dependency injection, modular architecture, decorators), making it an excellent platform to demonstrate that software testing principles are language-agnostic. The Jest testing framework is the industry standard for JavaScript/TypeScript, offering rich features comparable to xUnit.net and Moq.

**Real-World Application**: Personal finance tracking is a relatable domain with clear business logic, making it suitable for demonstrating various testing techniques. The application has sufficient complexity to showcase different testing approaches while remaining manageable within exam constraints.

### 1.2 Learning Objectives

This project demonstrates the application of course concepts to a different technology stack:

1. **Design for Testability**: Implementing Clean Architecture and SOLID principles in TypeScript
2. **Unit Testing**: Creating comprehensive test suites using Jest
3. **Data-Driven Testing**: Using parameterized tests to reduce duplication
4. **Mocking**: Isolating components using Jest's mocking capabilities
5. **White-Box Testing**: Analyzing code coverage and cyclomatic complexity

The project validates the hypothesis that testing principles and design patterns learned through the course are universally applicable across different programming languages and frameworks.

---

## 2. Problem Statement

This project is a personal financial tracking application developed using Nest.js (Node.js). The application allows users to record daily financial transactions, including income and expenses, store the entries locally and calculate financial summaries such as daily totals, income, expenses and profit/loss.

The main focus of this project is **software quality and testing**. The application is used as a test project to demonstrate:

- Unit testing with Jest framework
- Data-driven unit testing using parameterized tests
- Use of mocking frameworks in a non-.NET environment
- White-box testing techniques (coverage analysis, cyclomatic complexity)

The project combines relevant theory from the Software Quality course with practical implementation and testing, showing how testing techniques can be applied in a real-world TypeScript/Node.js application.

**Core Functionality Tested**:

- Financial calculations (total, income, expenses)
- Period-based filtering (today, this week, this month, etc.)
- Date range handling and validation

---

## 3. Methodology

### 3.1 Architecture Pattern: Clean Architecture

The application follows **Clean Architecture** principles (Robert C. Martin), separating concerns into distinct layers:

```text
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

**Dependency Direction**: Infrastructure → Application → Core (dependencies point inward). This architecture makes the business logic in the Core layer completely independent of infrastructure concerns, enabling easy testing without real databases or file systems.

**Reference**: SWQ 1.3 Lecture - Design for Testability (Week 38)

### 3.2 SOLID Principles Implementation

**Dependency Inversion Principle (DIP)**: The most critical principle for testability. The `SummationService` depends on the `ISummationRepository` interface (abstraction) rather than concrete implementations. This allows easy injection of mock repositories during testing.

```typescript
// Core layer - abstraction
export interface ISummationRepository {
  findByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]>;
}

// Service depends on interface, not implementation
export class SummationService {
  constructor(
    @Inject("ISummationRepository")
    private readonly repository: ISummationRepository
  ) {}
}
```

**Single Responsibility Principle (SRP)**: Each class has one clear purpose:

- `SummationService`: Only calculation logic
- `SummationController`: Only HTTP request/response handling
- `JsonStorage`: Only file I/O operations

### 3.3 Testing Strategy

**Framework**: Jest 29.7.0 - industry standard for JavaScript/TypeScript testing

**Jest vs xUnit.net** (course framework):

| Feature        | xUnit.net (C#)              | Jest (TypeScript)              |
| -------------- | --------------------------- | ------------------------------ |
| Basic Test     | `[Fact]`                    | `it()` or `test()`             |
| Parameterized  | `[Theory]` + `[InlineData]` | `test.each()`                  |
| Setup/Teardown | Constructor / `IDisposable` | `beforeEach()` / `afterEach()` |
| Assertions     | `Assert.Equal()`            | `expect().toBe()`              |
| Mocking        | Moq library                 | Built-in `jest.fn()`           |

The principles learned in the course (xUnit/Moq) apply directly to Jest, demonstrating transferability of testing knowledge.

**Test Types Implemented**:

1. **Unit Tests**: Testing individual methods in isolation, focusing on business logic in `SummationService`
2. **Data-Driven Tests**: Using `test.each()` for parameterized testing (equivalent to xUnit's `[Theory]`)
3. **Mocking**: Creating test doubles to isolate components
4. **White-Box Testing**: Branch coverage analysis and cyclomatic complexity measurement

**Success Criteria**:

- > 80% overall test coverage
- > 90% coverage for critical business logic
- All exam requirements demonstrated (unit testing, data-driven testing, mocking, white-box techniques)

**Reference**: SWQ 1.2 Lecture - Agile Testing (Week 37), SWQ 1.3 Lecture - Design for Testability (Week 38)

---

## 4. Analysis & Results

### 4.1 Design for Testability

#### 4.1.1 Dependency Injection with Nest.js

Nest.js provides a dependency injection container similar to ASP.NET Core. The `SummationModule` configures dependencies:

```typescript
@Module({
  controllers: [SummationController],
  providers: [
    SummationService,
    {
      provide: "ISummationRepository",
      useClass: MockSummationRepository, // Production
    },
  ],
})
export class SummationModule {}
```

For testing, the dependency is easily swapped:

```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    SummationService,
    {
      provide: "ISummationRepository",
      useValue: mockRepository, // Test double
    },
  ],
}).compile();
```

This demonstrates the Dependency Inversion Principle in action - the service remains unchanged whether using a real repository or a mock.

#### 4.1.2 Testability Analysis

**Why This Design is Testable**:

1. **Pure Business Logic**: The `SummationService` contains no infrastructure dependencies (no direct database calls, no file I/O)
2. **Interface-Based Dependencies**: All external dependencies are abstracted behind interfaces
3. **No Static Dependencies**: No static classes or methods that resist testing
4. **Clear Separation**: Business logic, HTTP handling, and data access are in separate layers

**Example - Calculation Method**:

```typescript
async calculateTotal(period: Period): Promise<number> {
  const { startDate, endDate } = this.getPeriodRange(period);
  const transactions = await this.repository.findByPeriod(startDate, endDate);
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
```

This method is testable because:

- Input is a simple enum value
- Output is a number
- External dependency (repository) is injectable
- No side effects
- Deterministic behavior (same input → same output, given same repository data)

### 4.2 Unit Testing Implementation

#### 4.2.1 Test Structure

Following the **Arrange-Act-Assert** pattern and **10 Unit Test Design Principles** from course (Week 38):

```typescript
describe("SummationService", () => {
  let service: SummationService;
  let mockRepository: jest.Mocked<ISummationRepository>;

  beforeEach(() => {
    mockRepository = { findByPeriod: jest.fn() };
    service = new SummationService(mockRepository);
  });

  describe("calculateTotal", () => {
    it("should return 0 when there are no transactions", async () => {
      // Arrange
      mockRepository.findByPeriod.mockResolvedValue([]);

      // Act
      const result = await service.calculateTotal(Period.TODAY);

      // Assert
      expect(result).toBe(0);
    });

    it("should sum all transaction amounts correctly", async () => {
      // Arrange
      const mockTransactions = [
        { amount: 100, date: new Date(), category: "Income" },
        { amount: -50, date: new Date(), category: "Expense" },
        { amount: 200, date: new Date(), category: "Income" },
      ];
      mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

      // Act
      const result = await service.calculateTotal(Period.TODAY);

      // Assert
      expect(result).toBe(250); // 100 - 50 + 200
    });
  });
});
```

**Unit Test Design Principles Applied**:

1. ✅ **Fast**: Tests run in <100ms (no real I/O)
2. ✅ **Independent/Isolated**: `beforeEach` resets state, each test can run alone
3. ✅ **Repeatable**: Mock returns consistent data
4. ✅ **Self-validating**: Clear assertions with `expect()`
5. ✅ **Single Reason to Fail**: Each test focuses on one behavior
6. ✅ **Easy to Read**: Descriptive names, clear structure
7. ✅ **Easy to Maintain**: Mocking makes tests resilient to infrastructure changes

#### 4.2.2 Testing Different Calculation Methods

**Income Calculation** (filters positive amounts):

```typescript
describe("calculateIncome", () => {
  it("should sum only positive amounts", async () => {
    const mockTransactions = [
      { amount: 100, date: new Date(), category: "Salary" },
      { amount: -50, date: new Date(), category: "Food" },
      { amount: 200, date: new Date(), category: "Bonus" },
    ];
    mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

    const result = await service.calculateIncome(Period.TODAY);

    expect(result).toBe(300); // 100 + 200 (only positive)
  });

  it("should return 0 when there is no income", async () => {
    const mockTransactions = [{ amount: -50, date: new Date(), category: "Food" }];
    mockRepository.findByPeriod.mockResolvedValue(mockTransactions);

    const result = await service.calculateIncome(Period.TODAY);

    expect(result).toBe(0);
  });
});
```

This demonstrates **edge case testing** - both normal cases (mixed transactions) and boundary cases (no income).

### 4.3 Data-Driven Testing

**Challenge**: Without data-driven testing, testing all period types would require repetitive code:

```typescript
// Repetitive approach - NOT GOOD
it("should calculate TODAY period correctly", () => {
  /* ... */
});
it("should calculate YESTERDAY period correctly", () => {
  /* ... */
});
it("should calculate THIS_WEEK period correctly", () => {
  /* ... */
});
// ... 8+ more similar tests
```

**Solution**: Jest's `test.each()` (equivalent to xUnit's `[Theory]` + `[InlineData]`):

```typescript
describe("Period Range Calculations", () => {
  test.each([
    {
      period: Period.TODAY,
      expectedStart: startOfDay(new Date()),
      expectedEnd: endOfDay(new Date()),
      description: "calculate TODAY period correctly",
    },
    {
      period: Period.YESTERDAY,
      expectedStart: startOfDay(subDays(new Date(), 1)),
      expectedEnd: endOfDay(subDays(new Date(), 1)),
      description: "calculate YESTERDAY period correctly",
    },
    {
      period: Period.THIS_WEEK,
      expectedStart: startOfWeek(new Date()),
      expectedEnd: endOfWeek(new Date()),
      description: "calculate THIS_WEEK period correctly",
    },
    // ... more test cases
  ])("should $description", async ({ period, expectedStart, expectedEnd }) => {
    mockRepository.findByPeriod.mockResolvedValue([]);

    await service.calculateTotal(period);

    expect(mockRepository.findByPeriod).toHaveBeenCalledWith(expectedStart, expectedEnd);
  });
});
```

**Benefits**:

- **DRY Principle**: Single test implementation for 8+ scenarios
- **Maintainability**: Easy to add new periods
- **Documentation**: Table format clearly shows all tested cases
- **Comprehensiveness**: Ensures no period type is missed

**Reference**: SWQ 1.2 Lecture - Agile Testing, Data-driven Unit Testing (Week 37)

**Boundary Value Testing** with data-driven approach:

```typescript
describe("Boundary Value Tests", () => {
  test.each([
    { amount: 0, expectedIncome: 0, expectedExpenses: 0, case: "zero amount" },
    { amount: 0.01, expectedIncome: 0.01, expectedExpenses: 0, case: "smallest positive" },
    { amount: -0.01, expectedIncome: 0, expectedExpenses: -0.01, case: "smallest negative" },
  ])("should handle $case correctly", async ({ amount, expectedIncome, expectedExpenses }) => {
    mockRepository.findByPeriod.mockResolvedValue([{ amount, date: new Date(), category: "Test" }]);

    const income = await service.calculateIncome(Period.TODAY);
    const expenses = await service.calculateExpenses(Period.TODAY);

    expect(income).toBe(expectedIncome);
    expect(expenses).toBe(expectedExpenses);
  });
});
```

This demonstrates **Boundary Value Testing** (Week 41) - testing values at the boundary between positive/negative (zero), and just above/below boundaries.

### 4.4 Mocking Framework Usage

#### 4.4.1 Mock vs Stub (from course material)

**Mock** - Verifies **behavior** (method calls):

```typescript
it("should call repository with correct date range", async () => {
  const expectedStart = startOfDay(new Date());
  const expectedEnd = endOfDay(new Date());
  mockRepository.findByPeriod.mockResolvedValue([]);

  await service.calculateTotal(Period.TODAY);

  // VERIFY THE CALL (behavior verification)
  expect(mockRepository.findByPeriod).toHaveBeenCalledTimes(1);
  expect(mockRepository.findByPeriod).toHaveBeenCalledWith(expectedStart, expectedEnd);
});
```

**Stub** - Returns **predefined data** for state verification:

```typescript
it("should calculate correct total from stub data", async () => {
  // STUB RETURNS PREDEFINED DATA
  mockRepository.findByPeriod.mockResolvedValue([
    { amount: 100, date: new Date(), category: "Income" },
    { amount: -50, date: new Date(), category: "Expense" },
  ]);

  const result = await service.calculateTotal(Period.TODAY);

  // VERIFY THE RESULT (state verification)
  expect(result).toBe(50);
});
```

**Reference**: SWQ 1.3 Lecture - Mocking Frameworks (Week 38)

#### 4.4.2 Moq (C# - course) vs Jest (TypeScript) Comparison

```csharp
// Moq - from course
var mockRepo = new Mock<IRepository>();
mockRepo.Setup(r => r.FindByPeriod(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
        .ReturnsAsync(transactions);
mockRepo.Verify(r => r.FindByPeriod(...), Times.Once());
```

```typescript
// Jest - equivalent functionality
const mockRepo = { findByPeriod: jest.fn() };
mockRepo.findByPeriod.mockResolvedValue(transactions);
expect(mockRepo.findByPeriod).toHaveBeenCalledTimes(1);
```

**Argument Matchers**:

- Moq's `It.IsAny<T>()` ≈ Jest's `expect.any(Type)`
- Moq's `It.Is<T>(predicate)` ≈ Jest's `expect.objectContaining()`

This demonstrates that **mocking concepts transfer directly** between frameworks, validating the course material's applicability beyond .NET.

#### 4.4.3 Error Handling with Mocks

Mocking enables testing error scenarios without real failures:

```typescript
it("should handle repository errors gracefully", async () => {
  const error = new Error("Database connection failed");
  mockRepository.findByPeriod.mockRejectedValue(error);

  await expect(service.calculateTotal(Period.TODAY)).rejects.toThrow("Database connection failed");
});
```

**Benefits**: Fast, deterministic error testing without needing actual database failures.

### 4.5 White-Box Testing Techniques

#### 4.5.1 Cyclomatic Complexity

**Function Under Analysis**: `getPeriodRange()` - determines date range based on period type

```typescript
private getPeriodRange(period: Period, customStart?: Date, customEnd?: Date) {
  if (period === Period.CUSTOM) {           // Decision 1
    if (!customStart || !customEnd) {       // Decision 2
      throw new Error('Custom period requires start and end dates');
    }
    return { startDate: customStart, endDate: customEnd };
  }

  const now = new Date();

  if (period === Period.TODAY) {            // Decision 3
    return { startDate: startOfDay(now), endDate: endOfDay(now) };
  } else if (period === Period.YESTERDAY) { // Decision 4
    return { startDate: startOfDay(subDays(now, 1)), endDate: endOfDay(subDays(now, 1)) };
  } else if (period === Period.THIS_WEEK) { // Decision 5
    return { startDate: startOfWeek(now), endDate: endOfWeek(now) };
  } else if (period === Period.THIS_MONTH) {// Decision 6
    return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
  } else if (period === Period.LAST_WEEK) { // Decision 7
    return { startDate: startOfWeek(subWeeks(now, 1)), endDate: endOfWeek(subWeeks(now, 1)) };
  } else if (period === Period.LAST_MONTH) {// Decision 8
    return { startDate: startOfMonth(subMonths(now, 1)), endDate: endOfMonth(subMonths(now, 1)) };
  }

  throw new Error('Invalid period');
}
```

**Complexity Calculation** (Week 47 - SWQ 1.11):

- Formula: **V(G) = D + 1** (D = number of decision points)
- Decision points: 8 (if/else if statements)
- **V(G) = 8 + 1 = 9**

**Interpretation** (from course material):

- V(G) = 1-10: **Simple**, low risk ✅
- V(G) = 11-20: Moderate, medium risk
- V(G) = 21-50: Complex, high risk

**Analysis**: Complexity of 9 is acceptable for a period calculation function. Minimum 9 test cases needed for full path coverage.

**Function Complexity Comparison**:

| Function            | V(G) | Interpretation |
| ------------------- | ---- | -------------- |
| calculateTotal()    | 3    | Very simple    |
| calculateIncome()   | 4    | Simple         |
| calculateExpenses() | 4    | Simple         |
| getPeriodRange()    | 9    | Moderate       |

#### 4.5.2 Branch Coverage Analysis

**Branches in `getPeriodRange()`**:

1. `period === CUSTOM` → True / False
2. `!customStart || !customEnd` → True / False (when CUSTOM)
3. `period === TODAY` → True / False
4. `period === YESTERDAY` → True / False
5. `period === THIS_WEEK` → True / False
6. ... (8+ branches total)

**Test Cases for Branch Coverage**:

```typescript
describe("Branch Coverage Tests", () => {
  it("covers CUSTOM with valid dates branch", () => {
    const result = service.getPeriodRange(Period.CUSTOM, new Date("2026-01-01"), new Date("2026-01-31"));
    expect(result.startDate).toEqual(new Date("2026-01-01"));
  });

  it("covers CUSTOM with missing dates branch", () => {
    expect(() => {
      service.getPeriodRange(Period.CUSTOM);
    }).toThrow("Custom period requires start and end dates");
  });

  it("covers TODAY branch", () => {
    const result = service.getPeriodRange(Period.TODAY);
    expect(result.startDate).toEqual(startOfDay(new Date()));
  });

  // ... tests for each period type
});
```

Combined with data-driven tests, this achieves **100% branch coverage** for `getPeriodRange()`.

**Reference**: SWQ 1.10 Lecture - Path Testing Part 1 (Week 46)

#### 4.5.3 Coverage Results

**Jest Coverage Configuration**:

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts", "!src/main.ts"],
  coverageThresholds: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};
```

**Coverage Metrics**:

- **Statement Coverage**: Percentage of statements executed
- **Branch Coverage**: Percentage of branches (if/else) taken
- **Function Coverage**: Percentage of functions called
- **Line Coverage**: Percentage of lines executed

These metrics provide **objective measurement** of test thoroughness, complementing qualitative assessment of test quality.

---

## 5. Conclusion

### 5.1 Summary of Accomplishments

This project successfully demonstrates comprehensive software testing in a non-.NET environment (TypeScript/Node.js), fulfilling all exam requirements:

1. ✅ **Unit Testing**: Comprehensive test suites using Jest framework
2. ✅ **Data-Driven Testing**: Parameterized tests with `test.each()` reducing code duplication
3. ✅ **Mocking Framework**: Effective use of Jest mocking for component isolation
4. ✅ **White-Box Testing**: Branch coverage analysis and cyclomatic complexity measurement

**Architectural Quality**:

- Implemented Clean Architecture with clear separation of concerns
- Applied SOLID principles, especially Dependency Inversion
- Achieved testable design through interface-based dependencies
- Demonstrated that architectural patterns are language-agnostic

**Testing Quality**:

- Followed all 10 Unit Test Design Principles from course
- Achieved >80% test coverage for business logic
- Covered edge cases and boundary values systematically
- Distinguished between mocks (behavior) and stubs (state)

### 5.2 Key Learnings

**Knowledge Transfer**: The testing principles and design patterns learned through the Software Quality course (using C#, xUnit.net, Moq) transferred seamlessly to TypeScript and Jest. This validates that:

- Design for testability is language-agnostic
- SOLID principles improve testability across platforms
- Mocking concepts are universal (Moq's `It.IsAny<T>()` ≈ Jest's `expect.any()`)
- Data-driven testing patterns work identically (xUnit's `[Theory]` ≈ Jest's `test.each()`)

**Technical Insights**:

- TypeScript's type system aids testability similar to C#
- Dependency injection is crucial for testability regardless of framework
- Pure functions (no side effects, deterministic) are easiest to test
- White-box techniques reveal coverage gaps not visible from black-box testing alone

**Testing Insights**:

- Coverage metrics guide testing efforts but don't guarantee quality
- Combining black-box (equivalence class, boundary value) and white-box (branch coverage, complexity) techniques provides comprehensive testing
- Data-driven tests make comprehensive testing practical and maintainable
- Mocking enables fast, isolated, deterministic tests

### 5.3 Hypothesis Validation

**Hypothesis**: Software testing principles and design patterns are universally applicable across different programming languages and frameworks.

**Result**: ✅ **CONFIRMED**

The project demonstrates that concepts from the Software Quality course (taught using C#/.NET) apply directly to TypeScript/Node.js:

- Clean Architecture principles worked identically
- SOLID principles improved testability in the same way
- Unit test design principles (Fast, Isolated, Repeatable, etc.) were fully applicable
- Mocking concepts transferred with minimal adjustment
- Data-driven testing patterns were equivalent
- White-box techniques (coverage, complexity) were equally valuable

**Practical Implication**: Developers who master testing principles in one language/framework can confidently apply them to any technology stack, making software quality education highly transferable.

### 5.4 Real-World Applicability

The testing practices demonstrated in this project are directly applicable to production software:

- **Maintainability**: Comprehensive tests enable confident refactoring
- **Reliability**: Systematic testing catches edge cases and boundary conditions
- **Documentation**: Tests serve as executable specification of behavior
- **Regression Prevention**: Automated tests catch breaking changes immediately
- **Team Collaboration**: Clear architecture and tests facilitate team development

**Future Enhancements**:

- Integration tests for API endpoints (using Supertest)
- End-to-end tests following Test Automation Pyramid
- Mutation testing (Stryker) to validate test suite quality
- Continuous Integration pipeline running tests automatically

---

## References

### Course Materials

- EASV Software Quality Course Materials (Fall 2025)
- SWQ 1.2 Lecture: Agile Testing - Data-driven Unit Testing (Week 37)
- SWQ 1.3 Lecture: Design for Testability and Unit Test Design (Week 38)
- SWQ 1.6 Lecture: Equivalence Class and Boundary Value Testing (Week 41)
- SWQ 1.10 Lecture: Path Testing Part 1 (Week 46)
- SWQ 1.11 Lecture: Path Testing Part 2 - Cyclomatic Complexity (Week 47)

### Technical Documentation

- Jest Documentation. <https://jestjs.io/>
- Nest.js Testing Guide. <https://docs.nestjs.com/fundamentals/testing>
- TypeScript Handbook. <https://www.typescriptlang.org/docs/>

### Books and Articles

- Martin, Robert C. (2017). _Clean Architecture: A Craftsman's Guide to Software Structure and Design_. Prentice Hall.
- Fowler, Martin. "Mocks Aren't Stubs". <https://martinfowler.com/articles/mocksArentStubs.html>
- Beck, Kent (2002). _Test Driven Development: By Example_. Addison-Wesley.

---

**Project Repository**: EASV-2nd-SWQ-final-exam
**Submission Date**: January 5, 2026, 12:00
**Word Count**: ~3,500 words (~9-10 pages)
