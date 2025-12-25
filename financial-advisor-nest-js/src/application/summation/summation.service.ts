import { Injectable, Inject } from '@nestjs/common';
import { ISummationRepository, ISummationRecord } from '../../core';
import { SummationQueryDto } from './dto/summation-query.dto';
import { SummationResultDto } from './dto/summation-result.dto';
import { Duration } from './enums/duration.enum';
import { SemanticDuration } from './enums/semantic-duration.enum';

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
    const dateRange = this.getDateRange(query);
    const records = await this.repository.findByDateRange(
      dateRange.startDate,
      dateRange.endDate,
    );

    const duration = query.duration || Duration.MONTH;
    return this.groupAndSum(records, duration);
  }

  /**
   * Calculate sum of income (positive values) grouped by duration
   */
  async getIncomeSumByDuration(
    query: SummationQueryDto,
  ): Promise<SummationResultDto[]> {
    const dateRange = this.getDateRange(query);
    const records = await this.repository.findByDateRange(
      dateRange.startDate,
      dateRange.endDate,
    );

    const incomeRecords = records.filter((record) => record.amount > 0);
    const duration = query.duration || Duration.MONTH;
    return this.groupAndSum(incomeRecords, duration);
  }

  /**
   * Calculate sum of expenses (negative values) grouped by duration
   */
  async getExpensesSumByDuration(
    query: SummationQueryDto,
  ): Promise<SummationResultDto[]> {
    const dateRange = this.getDateRange(query);
    const records = await this.repository.findByDateRange(
      dateRange.startDate,
      dateRange.endDate,
    );

    const expenseRecords = records.filter((record) => record.amount < 0);
    const duration = query.duration || Duration.MONTH;
    return this.groupAndSum(expenseRecords, duration);
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

  /**
   * Get date range from query (supports semantic durations)
   */
  private getDateRange(query: SummationQueryDto): {
    startDate: Date;
    endDate: Date;
  } {
    if (query.semanticDuration) {
      return this.getSemanticDateRange(query.semanticDuration);
    }

    return {
      startDate: query.startDate || new Date(0),
      endDate: query.endDate || new Date(),
    };
  }

  /**
   * Convert semantic duration to date range
   */
  private getSemanticDateRange(semantic: SemanticDuration): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    switch (semantic) {
      case SemanticDuration.TODAY: {
        return {
          startDate: new Date(today),
          endDate,
        };
      }

      case SemanticDuration.YESTERDAY: {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return {
          startDate: yesterday,
          endDate: yesterdayEnd,
        };
      }

      case SemanticDuration.THIS_WEEK: {
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1),
        );
        return {
          startDate: startOfWeek,
          endDate,
        };
      }

      case SemanticDuration.LAST_WEEK: {
        const dayOfWeek = today.getDay();
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - dayOfWeek - 6);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
        endOfLastWeek.setHours(23, 59, 59, 999);
        return {
          startDate: startOfLastWeek,
          endDate: endOfLastWeek,
        };
      }

      case SemanticDuration.THIS_MONTH: {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          startDate: startOfMonth,
          endDate,
        };
      }

      case SemanticDuration.LAST_MONTH: {
        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
        );
        endOfLastMonth.setHours(23, 59, 59, 999);
        return {
          startDate: startOfLastMonth,
          endDate: endOfLastMonth,
        };
      }

      case SemanticDuration.THIS_YEAR: {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return {
          startDate: startOfYear,
          endDate,
        };
      }

      case SemanticDuration.LAST_YEAR: {
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        endOfLastYear.setHours(23, 59, 59, 999);
        return {
          startDate: startOfLastYear,
          endDate: endOfLastYear,
        };
      }

      default:
        throw new Error('Unsupported semantic duration');
    }
  }
}
