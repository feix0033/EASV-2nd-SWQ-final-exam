import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Duration } from '../enums/duration.enum';
import { SemanticDuration } from '../enums/semantic-duration.enum';

export class SummationQueryDto {
  @ApiProperty({
    enum: Duration,
    required: false,
    description: 'How to group results (default: month)',
    example: 'day',
  })
  @IsOptional()
  @IsEnum(Duration)
  duration?: Duration;

  @ApiProperty({
    enum: SemanticDuration,
    required: false,
    description:
      'Time range relative to now (if provided, startDate/endDate are ignored)',
    example: 'yesterday',
  })
  @IsOptional()
  @IsEnum(SemanticDuration)
  semanticDuration?: SemanticDuration;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Start date (only used if semanticDuration is not provided)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'End date (only used if semanticDuration is not provided)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
