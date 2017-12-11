import {TransportApi, TransportHeaders} from '../types/apis/TransportAPI';
import {rs as RsType} from '../types/base';
import {BaseTransaction, Signature} from '../types/beans';

export const transport = (rs: RsType): (headers: TransportHeaders) => TransportApi =>
  (headers: TransportHeaders) => ({
    getHeaders() {
      return headers;
    },
    getHeight(cback) {
      return rs({
        headers,
        noApiPrefix: true,
        path       : 'peer/height',
      }, cback);
    },
    listPeers(cback) {
      return rs({
        headers,
        noApiPrefix: true,
        path       : 'peer/list',
      }, cback);
    },
    ping(cback) {
      return rs({
        headers,
        noApiPrefix: true,
        path       : 'peer/ping',
      }, cback);
    },
    postTransaction(transaction: BaseTransaction<any>, cback) {
      return rs({
        data       : {transaction},
        headers,
        method     : 'POST',
        noApiPrefix: true,
        path       : 'peer/transactions',
      }, cback);
    },
    postTransactions(transactions: Array<BaseTransaction<any>>, cback) {
      return rs({
        data       : {transactions},
        headers,
        method     : 'POST',
        noApiPrefix: true,
        path       : 'peer/transactions',
      }, cback);
    },
    postSignature(signature: Signature|Signature[], cback) {
      return rs({
        data       : (() => {
          if (Array.isArray(signature)) {
            return { signatures: signature };
          } else {
            return { signature };
          }
        })(),
        headers,
        method     : 'POST',
        noApiPrefix: true,
        path       : 'peer/signatures',
      }, cback);
    },
  });
