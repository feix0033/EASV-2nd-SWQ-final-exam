import { Module } from '@nestjs/common';
import { CoreModule } from '../../core';
import { SummationService } from './summation.service';
import { SummationController } from './summation.controller';

/**
 * Summation module - Application layer
 * Contains business logic, use cases, DTOs, and controllers
 *
 * Dependencies:
 * - Imports CoreModule to access domain interfaces
 * - Uses ISummationRepository via dependency injection
 * - No direct infrastructure dependencies
 *
 * Follows onion architecture principles.
 */
@Module({
  imports: [CoreModule],
  controllers: [SummationController],
  providers: [SummationService],
  exports: [SummationService],
})
export class SummationModule {}
