import { Module } from '@nestjs/common';
import { SummationService } from './summation.service';
import { SummationController } from './summation.controller';

/**
 * Summation module - Application/Domain layer
 * Contains business logic, use cases, and domain models
 * No infrastructure dependencies - follows onion architecture
 */
@Module({
  controllers: [SummationController],
  providers: [SummationService],
  exports: [SummationService],
})
export class SummationModule {}
