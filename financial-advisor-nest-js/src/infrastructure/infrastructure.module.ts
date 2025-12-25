import { Module } from '@nestjs/common';
import { CoreModule } from '../core';
import { MockSummationRepository } from './repositories/mock-summation.repository';

/**
 * Infrastructure module - provides concrete implementations of repositories
 * This is the outermost layer in onion architecture
 *
 * Dependencies:
 * - Imports CoreModule to access domain interfaces
 * - Implements repository interfaces defined in core
 *
 * Todo: Replace MockSummationRepository with real database implementation (TypeORM, Prisma, etc.)
 */
@Module({
  imports: [CoreModule],
  providers: [
    {
      provide: 'ISummationRepository',
      useClass: MockSummationRepository,
    },
  ],
  exports: ['ISummationRepository'],
})
export class InfrastructureModule {}
