import {BaseApiResponse, cback} from '../base';

export interface SignaturesAPI {
  /**
   * @deprecated
   */
  add(data: { secret: string, secondSecret: string, publicKey?: string }, callback?: cback<any>): Promise<any>;

  /**
   * Fetch the current fee for creatign a second signature account
   */
  getSecondSignatureFee(callback?: cback<{ fee: number }>): Promise<BaseApiResponse & { fee: number }>;
}
