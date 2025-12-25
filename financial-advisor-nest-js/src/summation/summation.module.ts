import { Module } from '@nestjs/common';
import { SummationService } from './summation.service';
import { SummationController } from './summation.controller';
import { MockSummationRepository } from './repositories/mock-summation.repository';

@Module({
  controllers: [SummationController],
  providers: [
    SummationService,
    {
      provide: 'ISummationRepository',
      useClass: MockSummationRepository, // Replace this with the acture implementation.
    },
  ],
  exports: [SummationService],
})
export class SummationModule {}
