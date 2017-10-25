import {BaseApiResponse, cback} from '../base';
import {Delegate, Transaction} from '../beans';

export interface DelegatesAPI {
  enable(data: { secret: string, secondSecret?: string, username: string }, callback?: cback<Transaction<{ delegate: { username: string, publicKey: string } }>>): Promise<Transaction<{ delegate: { username: string, publicKey: string } }> & BaseApiResponse>;

  getList(query?: { limit?: number, offset?: number, orderBy?: string }, callback?: cback<{ delegates: Delegate[], totalCount: number }>): Promise<{ delegates: Delegate[], totalCount: number } & BaseApiResponse>;

  getByUsername(username: string, callback?: cback<{ delegate: Delegate }>): Promise<{ delegate: Delegate } & BaseApiResponse>;

  getByPublicKey(publicKey: string, callback?: cback<{ delegate: Delegate }>): Promise<{ delegate: Delegate } & BaseApiResponse>;

  getByKeyVal(key: 'publicKey' | 'username', value: string, callback?: cback<{ delegate: Delegate }>): Promise<{ delegate: Delegate } & BaseApiResponse>;

  getVoters(publicKey: string, callback?: cback<{ accounts: Array<{ username?: string, address: string, publicKey: string, balance: string }> }>): Promise<{ accounts: Array<{ username?: string, address: string, publicKey: string, balance: string }> } & BaseApiResponse>;

  toggleForging(obj: { secret: string, enable: boolean }, callback?: cback<{ address: string }>): Promise<{ address: string } & BaseApiResponse>;

  /**
   * Return the forged amount by account
   * @param param if string is passed it's threated as publicKey
   * @param callback callback to get the result
   */
  getForgedByAccount(param: string|{ generatorPublicKey: string, start: number, end: number }, callback?: cback<{ fees: string, rewards: string, forged: string }>): Promise<{ fees: string, rewards: string, forged: string, count?: number } & BaseApiResponse>;

  getForgingStatus(callback?: cback<{ enabled: boolean, delegates: string[] }>): Promise<{ enabled: boolean, delegates: string[] } & BaseApiResponse>;

  getForgingStatus(publicKey?: string, callback?: cback<{ enabled: boolean }>): Promise<{ enabled: boolean } & BaseApiResponse>;

  getNextForgers(limit: number, callback?: cback<{ currentBlock: number, currentBlockSlot: number, currentSlot: number, delegates: string[] }>): Promise<{ currentBlock: number, currentBlockSlot: number, currentSlot: number, delegates: string[] } & BaseApiResponse>;

}
