/**
 * Interface for a financial record that can be summed
 * Todo: Create the actual entity/model implementing this interface
 */
export interface ISummationRecord {
  amount: number;
  date: Date;
  // Add other fields as needed, but the service only needs these two
}
