import {BlocksAPI} from '../types/apis/BlocksAPI';
import {cback, rs as RsType} from '../types/base';
import {Block, BlockStatusResponse} from '../types/beans';

/**
 * @private
 * @internal
 */
export const blocks = (rs: RsType): BlocksAPI => ({

  // tslint:disable-next-line max-line-length
  getFeeSchedule(callback?: cback<{ fees: { send: number, vote: number, secondsignature: number, delegate: number, multisignature: number, dapp: number } }>) {
    return rs(
      {
        path: '/blocks/getFees',
      },
      callback);
  },

  getFee(callback?: cback<{ fee: number }>) {
    return rs(
      {
        path: '/blocks/getFee',
      },
      callback);
  },

  getReward(callback?: cback<{ reward: number }>) {
    return rs(
      {
        path: '/blocks/getReward',
      },
      callback);
  },

  getSupply(callback?: cback<{ supply: number }>) {
    return rs(
      {
        path: '/blocks/getSupply',
      },
      callback);
  },

  getStatus(callback?: cback<BlockStatusResponse>) {
    return rs(
      {
        path: '/blocks/getStatus',
      },
      callback);
  },

  getHeight(callback?: cback<{ height: number }>) {
    return rs(
      {
        path: '/blocks/getHeight',
      },
      callback);
  },

  getNethash(callback?: cback<{ nethash: string }>) {
    return rs(
      {
        path: '/blocks/getNethash',
      },
      callback);
  },

  getMilestone(callback?: cback<{ milestone: number }>) {
    return rs(
      {
        path: '/blocks/getMilestone',
      },
      callback);
  },

  getBlock(id: string, callback?: cback<{ block: Block }>) {
    return rs(
      {
        params: { id },
        path  : '/blocks/get',
      },
      callback);
  },

  getBlocks(query: { [k: string]: any }, callback?: cback<{ blocks: Block[], count: number }>) {
    return rs(
      {
        params: { ...query },
        path  : '/blocks',
      },
      callback);
  },
});
