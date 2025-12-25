import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SummationService } from './summation.service';
import { Duration } from './enums/duration.enum';
import { SemanticDuration } from './enums/semantic-duration.enum';

@ApiTags('summation')
@Controller('summation')
export class SummationController {
  constructor(private readonly summationService: SummationService) {}

  @Get()
  @ApiOperation({
    summary: 'Get total summation',
    description:
      'Calculate sum of all transactions grouped by duration. ' +
      'Use semanticDuration for relative ranges (e.g., "yesterday") OR ' +
      'use startDate/endDate for specific ranges.',
  })
  @ApiQuery({ name: 'duration', enum: Duration, required: false })
  @ApiQuery({
    name: 'semanticDuration',
    enum: SemanticDuration,
    required: false,
  })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
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
  @ApiOperation({
    summary: 'Get income summation',
    description:
      'Calculate sum of positive values (income) grouped by duration. ' +
      'Use semanticDuration for relative ranges OR startDate/endDate for specific ranges.',
  })
  @ApiQuery({ name: 'duration', enum: Duration, required: false })
  @ApiQuery({
    name: 'semanticDuration',
    enum: SemanticDuration,
    required: false,
  })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
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
  @ApiOperation({
    summary: 'Get expenses summation',
    description:
      'Calculate sum of negative values (expenses) grouped by duration. ' +
      'Use semanticDuration for relative ranges OR startDate/endDate for specific ranges.',
  })
  @ApiQuery({ name: 'duration', enum: Duration, required: false })
  @ApiQuery({
    name: 'semanticDuration',
    enum: SemanticDuration,
    required: false,
  })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
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
