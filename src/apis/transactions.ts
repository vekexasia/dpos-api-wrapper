import { TransactionsAPI } from '../types/apis/TransactionsAPI';
import { cback, rs as RsType } from '../types/base';
import { BaseTransaction, Transaction } from '../types/beans';
/**
 * @private
 * @internal
 */
export const transactions = (rs: RsType): TransactionsAPI => ({

  get<T>(id: string, callback?: cback<{ transaction: BaseTransaction<T> & { height: number, blockId: string, confirmations: number }}>) {
    return rs({
      params: {id},
      path: '/transactions/get',
    }, callback);
  },

  count(callback?: cback<{ confirmed: number, multisignature: number, unconfirmed: number, queued: number }>) {
    return rs({
      path: '/transactions/count',
    }, callback);
  },

  getList(query = {}, callback?) {
    return rs({
      params: {...query},
      path: '/transactions',
    }, callback);
  },

  // tslint:disable-next-line max-line-length
  send(conf: { secret: string, amount: number, recipientId: string, publicKey?: string, secondSecret?: string }, callback?: cback<any>) {
    return rs({
      data: {...conf},
      method: 'PUT',
      path: '/transactions',
    }, callback);
  },

  getUnconfirmedList(query = {}, callback?) {
    return rs({
      params: {...query},
      path: '/transactions/unconfirmed',
    }, callback);
  },

  getUnconfirmedTransaction(id: string, callback?: cback<{ transactions: Array<BaseTransaction<any>> }>) {
    return rs({
      params: {id},
      path: '/transactions/unconfirmed/get',
    }, callback);
  },
});
