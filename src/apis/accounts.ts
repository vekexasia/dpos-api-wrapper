import { AccountsAPI } from '../types/apis/AccountsAPI';
import { cback, rs as RsType } from '../types/base';
import { Account, Delegate } from '../types/beans';

/**
 * @private
 * @internal
 */
export const accounts = (rs: RsType): AccountsAPI => ({

  open(secret: string, callback?: cback<{ account: Account }>) {
    return rs({
        data: {secret},
        method: 'POST',
        path: '/accounts/open/',
      },
      callback
    );
  },

  getBalance(address: string, callback?: cback<{ balance: string, unconfirmedBalance: string }>) {
    return rs(
      {
        params: {address},
        path: '/accounts/getBalance',
      },
      callback
    );
  },

  getPublicKey(address: string, callback?: cback<{ publicKey: string }>) {
    return rs(
      {
        params: {address},
        path: '/accounts/getPublicKey',
      },
      callback
    );
  },

  generatePublicKey(secret: string, callback?: cback<{ publicKey: string }>) {
    return rs(
      {
        data: {secret},
        method: 'POST',
        path: '/accounts/generatePublicKey',
      },
      callback
    );
  },

  getAccount(address: string, callback?: cback<{ account: Account }>) {
    return rs(
      {
        params: {address},
        path: '/accounts',
      },
      callback
    );
  },

  getAccountByPublicKey(publicKey: string, callback?: cback<{ account: Account }>) {
    return rs(
      {
        params: {publicKey},
        path: '/accounts',
      },
      callback
    );
  },

  getDelegates(address: string, callback?: cback<{ delegates: Delegate[] }>) {
    return rs(
      {
        params: {address},
        path: '/accounts/delegates',
      },
      callback
    );
  },

  /**
   * This method will stop working as it sends your secret over the network
   * @deprecated
   * @returns {Promise<any>}
   */
  // tslint:disable-next-line max-line-length
  putDelegates(data: { secret: string, publicKey: string, delegates: string[], secondSecret?: string }, callback?: cback<any>): Promise<any> {
    return rs(
      {
        data,
        method: 'PUT',
        path: '/accounts/delegates',
      },
      callback
    );
  },
});
