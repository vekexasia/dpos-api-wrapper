import axios from 'axios';
import {
  AccountsAPI,
  BlocksAPI,
  DappsAPI,
  DelegatesAPI,
  LoaderAPI,
  MultiSignaturesAPI,
  PeersAPI,
  SignaturesAPI,
  TransactionsAPI,
  TransportApi,
  TransportHeaders
} from './types/apis/';
import {
  accounts,
  blocks,
  dapps,
  delegates,
  loader,
  multiSignatures,
  peers,
  signatures,
  transactions,
  transport
} from './apis/';
import {BaseApiResponse, cback, rs} from './types/base';
import {BlockStatusResponse} from './types/beans';

export * from './types/beans';


export interface Rise extends APIWrapper {
  /**
   * Default Node Address: ex: http://localhost:1234 (no leading slash)
   */
  nodeAddress: string

  /**
   * Creates a new API Wrapper with the given node address.
   * So that you can be connected to multiple nodes at once.
   * @param nodeAddress Ex: http://localhost:1234 (no leading slash)
   */
  newWrapper(nodeAddress: string): APIWrapper
}

export interface APIWrapper {
  /**
   * Accounts APIs
   */
  accounts: AccountsAPI
  /**
   * Blocks Query APIs
   */
  blocks: BlocksAPI
  /**
   * Node loading status APIs
   */
  loader: LoaderAPI
  /**
   * Transactions APIs
   */
  transactions: TransactionsAPI
  /**
   * Peers APIs
   */
  peers: PeersAPI
  /**
   * Signature APIs
   */
  signatures: SignaturesAPI
  /**
   * Delegates APIs
   */
  delegates: DelegatesAPI
  /**
   * Multi Signature Accounts APIs
   */
  multiSignatures: MultiSignaturesAPI

  /**
   * Decentralized Apps APIs (in progress)
   */
  dapps: DappsAPI,

  /**
   * Easily create a transport API without providing headers.
   * @param {boolean} flushCache flush current transportAPI cache
   * @returns {Promise<TransportApi>}
   */
  buildTransport: (flushCache?: boolean) => Promise<TransportApi>

  /**
   * Access transport APIs
   * @param {TransportHeaders} headers
   * @returns {TransportApi}
   */
  transport: (headers: TransportHeaders) => TransportApi
}

const requester = (nodeAddress) => <R>(obj: { noApiPrefix?: boolean, headers?: any, params?: any, path: string, method?: string, data?: any }, cback: cback<R>): Promise<R & BaseApiResponse> => {
  return axios({
    url    : `${nodeAddress}/${obj.noApiPrefix ? '' : 'api'}${obj.path}`,
    json   : true,
    timeout: 4000,
    ...obj
  })
    .then(resp => {
      if (resp.data.success == false) {
        return Promise.reject(new Error(resp.data.error || resp.data.message));
      }
      return resp.data;
    })
    .then(a => {
      if (typeof(cback) !== 'undefined') {
        cback(null, a);
      }
      return a;
    })
    .catch(err => {
      if (typeof(cback) !== 'undefined') {
        cback(err);
      }
      return Promise.reject(err);
    })
};

function addTransportBuilder<T extends { blocks: BlocksAPI, peers: PeersAPI }>(obj: T, rs: rs): T & { buildTransport: (flushCache?: boolean) => Promise<TransportApi> } {
  let transportCache = null;
  obj['buildTransport'] = (flushCache: boolean = false) => {
    if (flushCache || transportCache === null) {
      return Promise.all([
        obj.peers.version(),
        obj.blocks.getStatus()
      ])
        .then((resp: [{ version: string }, BlockStatusResponse]) => ({
          nethash: resp[1].nethash,
          port   : 1000,
          version: resp[0].version
        }))
        .then(h => {
          transportCache = transport(rs)(h);
          return transportCache;
        })
    }
    return Promise.resolve(transportCache);
  };
  return obj as any; //TS bug 10727 on spread operators i need to do this.
}

export const rise: Rise = (() => {
  const toRet = {
    nodeAddress: '',
    newWrapper(nodeAddress: string): APIWrapper {
      let req = requester(nodeAddress);
      return addTransportBuilder(
        {
          accounts       : accounts(req),
          loader         : loader(req),
          transactions   : transactions(req),
          peers          : peers(req),
          blocks         : blocks(req),
          signatures     : signatures(req),
          delegates      : delegates(req),
          multiSignatures: multiSignatures(req),
          dapps          : dapps(req),
          transport      : transport(req)
        },
        req
      );
    }
  } as Rise;

  function rproxy<R>(obj: { params?: any, path: string, method?: string, data?: any }, cback: cback<R>): Promise<R & BaseApiResponse> {
    return requester(toRet.nodeAddress).apply(null, arguments);
  }

  toRet.accounts        = accounts(rproxy);
  toRet.loader          = loader(rproxy);
  toRet.transactions    = transactions(rproxy);
  toRet.peers           = peers(rproxy);
  toRet.blocks          = blocks(rproxy);
  toRet.signatures      = signatures(rproxy);
  toRet.delegates       = delegates(rproxy);
  toRet.multiSignatures = multiSignatures(rproxy);
  toRet.dapps           = dapps(rproxy);
  toRet.transport       = transport(rproxy);

  return addTransportBuilder(toRet, rproxy);
})();

