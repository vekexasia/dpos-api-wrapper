import { MultiSignaturesAPI } from '../types/apis/MultiSignaturesAPI';
import { cback, rs as RsType } from '../types/base';
/**
 * @private
 * @internal
 */
export const multiSignatures = (rs: RsType): MultiSignaturesAPI => ({
  getPending(publicKey: string, callback?: cback<any>) {
    return rs({
      params: { publicKey },
      path: '/multisignatures/pending',
    }, callback);
  },

  // tslint:disable-next-line max-line-length
  createMultiSigAccount(sig: { secret: string, lifetime: number, min: number, publicKeys: string[] }, callback?: cback<any>) {
    return rs({
      data: sig,
      method: 'PUT',
      path: '/multisignatures',
    }, callback);
  },

  sign(obj: { secret: string, publicKey: string, transactionId: string }, callback?: cback<any>) {
    return rs({
      data: obj,
      method: 'POST',
      path: '/multisignatures/sign',
    }, callback);
  },

  getAccounts(publicKey: string, callback?: cback<any>) {
    return rs({
      params: {publicKey},
      path: '/multisignatures/accounts',
    }, callback);
  },
});
