import {BaseApiResponse, cback} from '../base';
import {MultiSigTransaction} from '../beans';

export interface MultiSignaturesAPI {
  /**
   * Retrieve Pending multisig apis.
   * @param {string} publicKey multisig account publicKey
   * @param callback callback where to receive the result.
   */
  getPending(publicKey: string, callback?: cback<{ transactions: Array<{ min: number, max: number, lifetime: number, signed: true, transaction: MultiSigTransaction<any> }> }>): Promise<{ transactions: Array<{ min: number, max: number, lifetime: number, signed: true, transaction: MultiSigTransaction<any> }> } & BaseApiResponse>;

  /**
   * @deprecated
   */
  createMultiSigAccount(sig: { secret: string, lifetime: number, min: number, publicKeys: string[] }, callback?: cback<any>);

  /**
   * @deprecated
   */
  sign(obj: { secret: string, publicKey: string, transactionId: string }, callback?: cback<any>);

  getAccounts(publicKey: string, callback?: cback<any>);
}
