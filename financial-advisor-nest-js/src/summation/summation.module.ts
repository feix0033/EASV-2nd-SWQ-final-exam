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
      useClass: MockSummationRepository, // Todo: Replace this with the actual implementation
    },
  ],
  exports: [SummationService],
})
export class SummationModule {}
