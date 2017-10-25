import { MultiSignaturesAPI } from '../types/apis/MultiSignaturesAPI';
import { cback, rs as RsType } from '../types/base';
/**
 * @private
 * @internal
 */
export const multiSignatures = (rs: RsType): MultiSignaturesAPI => ({
  getPending(publicKey: string, callback?: cback<any>) {
    return rs({
      method: 'GET',
      params: { publicKey },
      path: '/multisignatures/pending',
    }, callback);
  },

  // tslint:disable-next-line max-line-length
  createMultiSigAccount(sig: { secret: string, lifetime: number, min: number, publicKeys: string[] }, callback?: cback<any>) {
    return rs({
      data: {
        keysgroup: sig.publicKeys,
        lifetime: sig.lifetime, // hours in integer
        min: sig.min, // min signatures need to approve
        secret: sig.secret,
      },
      method: 'PUT',
      path: '/multisignatures',
    }, callback);
  },

  sign(obj: { secret: string, publicKey: string, transactionId: string }, callback?: cback<any>) {
    return rs({
      data: {
        publicKey: obj.publicKey,
        secret: obj.secret,
        transactionId: obj.transactionId,
      },
      method: 'POST',
      path: '/multisignatures/sign',
    }, callback);
  },

  getAccounts(publicKey: string, callback?: cback<any>) {
    return rs({
      method: 'GET',
      params: {publicKey},
      path: '/multisignatures/accounts',
    }, callback);
  },
});
