import { Duration } from '../enums/duration.enum';

export class SummationQueryDto {
  duration: Duration;
  startDate?: Date;
  endDate?: Date;
}
