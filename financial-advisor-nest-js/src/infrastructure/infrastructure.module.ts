import { Module } from '@nestjs/common';
import { MockSummationRepository } from './repositories/mock-summation.repository';

/**
 * Infrastructure module - provides concrete implementations of repositories
 * This is the outermost layer in onion architecture
 * Todo: Replace MockSummationRepository with real database implementation (TypeORM, Prisma, etc.)
 */
@Module({
  providers: [
    {
      provide: 'ISummationRepository',
      useClass: MockSummationRepository,
    },
  ],
  exports: ['ISummationRepository'],
})
export class InfrastructureModule {}
