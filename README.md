# Financial Advisor - Personal Financial Tracking Application

A personal financial tracking application built with Nest.js (Node.js) that enables users to record, manage, and analyze their daily financial transactions.

## Overview

This application serves as a comprehensive solution for tracking daily income and expenses, with a strong emphasis on software quality and testing methodologies. Users can record financial transactions, store them locally, and generate insightful financial summaries including daily totals, income breakdowns, expenses, and profit/loss calculations.

## Problem Statement

This project is a personal financial tracking application developed using Nest.js (Node.js). The application allows users to record daily financial transactions, including income and expenses, store the entries locally and calculate financial summaries such as daily totals, income, expenses and profit/loss.

The main focus of this project is **software quality and testing**. The application is used as a test project to demonstrate:

- Unit testing
- Data-driven unit testing
- Use of mocking frameworks in a non-.NET environment
- White-box testing techniques

The project combines relevant theory from the course with practical implementation and testing, showing how testing techniques can be applied in a real-world application.

## Features

- **Transaction Management**: Record daily financial transactions (income and expenses)
- **Local Storage**: Persistent local data storage for all financial entries
- **Financial Summaries**: Calculate and display:
  - Daily totals
  - Income summaries
  - Expense breakdowns
  - Profit/loss analysis
- **Quality Assurance**: Comprehensive test coverage ensuring reliability and maintainability

## Technology Stack

- **Framework**: [Nest.js](https://nestjs.com/) v11.0.1
- **Runtime**: Node.js
- **Language**: TypeScript
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier
- **API Documentation**: Swagger/OpenAPI

## Project Setup

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

```bash
# Navigate to the project directory
cd financial-advisor-nest-js

# Install dependencies
npm install
```

## Running the Application

```bash
# Make sure you're in the project directory
cd financial-advisor-nest-js

# Development mode
npm run start

# Watch mode (auto-restart on changes)
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run start:prod
```

## API Documentation

This project includes integrated Swagger/OpenAPI documentation for all API endpoints.

### Accessing Swagger UI

Once the application is running, you can access the interactive API documentation at:

```
http://localhost:3000/api
```

The Swagger UI provides:

- Interactive API endpoint testing
- Request/response schemas
- Example payloads
- Authentication requirements
- Comprehensive API reference

### Swagger Configuration

The Swagger documentation is configured in `financial-advisor-nest-js/src/main.ts` and uses decorators in controllers to generate comprehensive API documentation automatically.

## Testing

This project emphasizes comprehensive testing practices with **70.14% overall coverage** and **100% coverage on all business logic**.

```bash
# Make sure you're in the project directory
cd financial-advisor-nest-js

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:cov

# Debug tests
npm run test:debug
```

### Testing Results

**Coverage Metrics** (as of January 13, 2026):
```
Overall Coverage: 70.14%
- Statement Coverage: 70.14%
- Branch Coverage: 83.60%
- Function Coverage: 75.47%
- Line Coverage: 73.57%
```

**Component Coverage:**
- ✅ SummationService: 100%
- ✅ SummationController: 100%
- ✅ TransactionsService: 100%
- ✅ TransactionsController: 100%

**Test Statistics:**
- 131 tests passed
- 5 test suites
- ~8.5 seconds execution time
- 0 flaky tests

### Testing Approach

The project demonstrates:

- **Unit Testing**: Testing individual components and services in isolation (131 tests)
- **Data-Driven Testing**: Using parameterized tests (`test.each()`) to validate multiple scenarios
- **Mocking**: Utilizing Jest's mocking capabilities to isolate dependencies
- **White-Box Testing**: Applying knowledge of internal code structure to ensure comprehensive coverage
- **Error Handling**: Testing error propagation and edge cases
- **Mock Isolation**: Ensuring tests don't call unrelated methods

## Code Quality

```bash
# Make sure you're in the project directory
cd financial-advisor-nest-js

# Format code with Prettier
npm run format

# Lint and fix code issues
npm run lint

# Build the project
npm run build
```

## Project Structure

```
financial-advisor-nest-js/
├── src/                    # Source code
│   ├── app.controller.ts   # Application controllers
│   ├── app.service.ts      # Business logic services
│   ├── app.module.ts       # Root module
│   └── main.ts            # Application entry point
├── test/                   # End-to-end tests
├── coverage/              # Test coverage reports
└── dist/                  # Compiled output
```

## Development Workflow

1. Write code following NestJS conventions
2. Create corresponding unit tests
3. Run tests to ensure functionality
4. Generate coverage reports to identify gaps
5. Refactor and improve code quality
6. Document findings and testing approaches

## Academic Context

This project is developed as part of a Software Quality course, specifically focusing on:

- Practical application of testing techniques
- Implementation of quality assurance processes
- Demonstration of white-box testing methodologies
- Use of modern testing frameworks outside the .NET ecosystem

## License

UNLICENSED - Academic project for educational purposes

## Author

EASV 2nd Semester - Software Quality Final Exam Project
