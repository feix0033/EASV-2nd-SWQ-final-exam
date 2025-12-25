import { ISummationRecord } from './summation-record.interface';

/**
 * Repository interface for data access
 * Todo: Implement this to connect to the actual data source
 */
export interface ISummationRepository {
  /**
   * Find all records within a date range
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Promise of records matching the criteria
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<ISummationRecord[]>;

  /**
   * Find all records (optional - for getting all data)
   */
  findAll(): Promise<ISummationRecord[]>;
}
