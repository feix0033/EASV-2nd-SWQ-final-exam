import { Duration } from '../enums/duration.enum';
import { SemanticDuration } from '../enums/semantic-duration.enum';

export class SummationQueryDto {
  duration?: Duration; // Grouping duration: day, week, month, year (default: month)
  semanticDuration?: SemanticDuration; // Semantic range: today, yesterday, lastweek, etc.
  startDate?: Date;
  endDate?: Date;
}
