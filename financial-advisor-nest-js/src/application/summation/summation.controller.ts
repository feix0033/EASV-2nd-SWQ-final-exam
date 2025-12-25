import { Controller, Get, Query } from '@nestjs/common';
import { SummationService } from './summation.service';
import { Duration } from './enums/duration.enum';
import { SemanticDuration } from './enums/semantic-duration.enum';

@Controller('summation')
export class SummationController {
  constructor(private readonly summationService: SummationService) {}

  @Get()
  async getSummation(
    @Query('duration') duration?: Duration,
    @Query('semanticDuration') semanticDuration?: SemanticDuration,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.summationService.calculateSumByDuration({
      duration,
      semanticDuration,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('income')
  async getIncomeSummation(
    @Query('duration') duration?: Duration,
    @Query('semanticDuration') semanticDuration?: SemanticDuration,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.summationService.getIncomeSumByDuration({
      duration,
      semanticDuration,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('expenses')
  async getExpensesSummation(
    @Query('duration') duration?: Duration,
    @Query('semanticDuration') semanticDuration?: SemanticDuration,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.summationService.getExpensesSumByDuration({
      duration,
      semanticDuration,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}
