import { Injectable, Inject } from '@nestjs/common';
import { ISummationRepository } from './interfaces/summation-repository.interface';
import { ISummationRecord } from './interfaces/summation-record.interface';
import { SummationQueryDto } from './dto/summation-query.dto';
import { SummationResultDto } from './dto/summation-result.dto';
import { Duration } from './enums/duration.enum';

@Injectable()
export class SummationService {
  constructor(
    @Inject('ISummationRepository')
    private readonly repository: ISummationRepository,
  ) {}

  /**
   * Calculate sum of amounts grouped by the specified duration
   */
  async calculateSumByDuration(
    query: SummationQueryDto,
  ): Promise<SummationResultDto[]> {
    const records = await this.repository.findByDateRange(
      query.startDate || new Date(0),
      query.endDate || new Date(),
    );

    return this.groupAndSum(records, query.duration);
  }

  /**
   * Group records by duration and calculate totals
   */
  private groupAndSum(
    records: ISummationRecord[],
    duration: Duration,
  ): SummationResultDto[] {
    const grouped = new Map<string, ISummationRecord[]>();

    records.forEach((record) => {
      const key = this.getPeriodKey(record.date, duration);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(record);
    });

    return Array.from(grouped.entries()).map(([period, periodRecords]) => {
      const dates = periodRecords.map((r) => r.date);
      return {
        period,
        total: periodRecords.reduce((sum, r) => sum + r.amount, 0),
        count: periodRecords.length,
        startDate: new Date(Math.min(...dates.map((d) => d.getTime()))),
        endDate: new Date(Math.max(...dates.map((d) => d.getTime()))),
      };
    });
  }

  /**
   * Generate period key based on duration type
   */
  private getPeriodKey(date: Date, duration: Duration): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (duration) {
      case Duration.DAY:
        return `${year}-${month}-${day}`;

      case Duration.WEEK: {
        const weekNumber = this.getWeekNumber(date);
        return `${year}-W${String(weekNumber).padStart(2, '0')}`;
      }

      case Duration.MONTH:
        return `${year}-${month}`;

      case Duration.YEAR:
        return `${year}`;

      default:
        throw new Error('Unsupported duration');
    }
  }

  /**
   * Get ISO week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
