import {DelegatesAPI} from '../types/apis/DelegatesAPI';
import {cback, rs as RsType} from '../types/base';
import {Delegate, Transaction} from '../types/beans';
// tslint:disable max-line-length
/**
 * @private
 * @internal
 */
export const delegates = (rs: RsType): DelegatesAPI => ({

  /**
   * Creates a new delegate. Be aware that this will send your secrets over the network
   * @deprecated
   */
  enable(data: { secret: string, secondSecret?: string, username: string }, callback?: cback<Transaction<{ delegate: { username: string, publicKey: string } }>>) {
    return rs(
      {
        data,
        method: 'PUT',
        path  : '/delegates',
      },
      callback
    );
  },

  getList(query: { limit?: number, offset?: number, orderBy?: string } = {}, callback?: cback<{ delegates: Delegate[], totalCount: number }>) {
    return rs(
      {
        params: query,
        path  : '/delegates',
      },
      callback
    );
  },

  getByUsername(username: string, callback?: cback<{ delegate: Delegate }>) {
    return this.getByKeyVal('username', username, callback);
  },

  getByPublicKey(publicKey: string, callback?: cback<{ delegate: Delegate }>) {
    return this.getByKeyVal('publicKey', publicKey, callback);
  },

  getByKeyVal(key: 'username' | 'publicKey', value: string, callback?: cback<{ delegate: Delegate }>) {
    const query = {};
    query[key]  = value;
    return rs(
      {
        params: query,
        path  : '/delegates/get',
      },
      callback
    );
  },

  getVoters(publicKey: string, callback?: cback<{ accounts: Array<{ username?: string, address: string, publicKey: string, balance: string }> }>) {
    return rs(
      {
        params: { publicKey },
        path  : '/delegates/voters',
      },
      callback
    );
  },

  toggleForging(obj: { secret: string, enable: boolean }, callback?: cback<{ address: string }>) {
    return rs(
      {
        data  : {
          secret: obj.secret,
        },
        method: 'POST',
        path  : `/delegates/forging/${obj.enable ? 'enable' : 'disable'}`,
      },
      callback
    );
  },

  getForgedByAccount(data: string | { generatorPublicKey: string, start: number, end: number }, callback?: cback<{ fees: string, rewards: string, forged: string }>) {
    return rs(
      {
        params: typeof(data) === 'string' ? {
          generatorPublicKey: data,
        } : data,
        path  : '/delegates/forging/getForgedByAccount',
      },
      callback
    );
  },

  getForgingStatus(publicKey?: string | cback<{ enabled: boolean, delegates: string[] }>, callback?: cback<{ enabled: boolean }>) {
    if (typeof(publicKey) === 'function') {
      callback  = publicKey;
      publicKey = undefined;
    }
    return rs(
      {
        params: { publicKey },
        path  : '/delegates/forging/status',
      },
      callback
    );
  },

  getNextForgers(limit: number, callback?: cback<{ currentBlock: number, currentBlockSlot: number, currentSlot: number, delegates: string[] }>) {
    return rs(
      {
        params: { limit },
        path  : '/delegates/getNextForgers',
      },
      callback
    );
  },
});
