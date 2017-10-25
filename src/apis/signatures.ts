import {SignaturesAPI} from '../types/apis/SignaturesAPI';
import {cback, rs as RsType} from '../types/base';

/**
 * @private
 * @internal
 */
export const signatures = (rs: RsType): SignaturesAPI => ({
  add(data: { secret: string, secondSecret: string, publicKey?: string }, callback?: cback<any>) {
    return rs({
      data,
      method: 'PUT',
      path  : '/signatures',
    }, callback);
  },
  getSecondSignatureFee(callback?: cback<any>) {
    return rs({
      path: '/signatures/fee',
    }, callback);
  },
});
