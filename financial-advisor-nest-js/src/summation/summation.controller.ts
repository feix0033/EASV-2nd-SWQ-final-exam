import { Controller, Get, Query } from '@nestjs/common';
import { SummationService } from './summation.service';
import { Duration } from './enums/duration.enum';

@Controller('summation')
export class SummationController {
  constructor(private readonly summationService: SummationService) {}

  @Get()
  async getSummation(
    @Query('duration') duration: Duration = Duration.MONTH,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.summationService.calculateSumByDuration({
      duration,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}
