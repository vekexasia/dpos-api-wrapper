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
import {addTransportBuilder, requester} from './internal_utils';
import {BaseApiResponse, cback as cbackType} from './types/base';

export * from './types/beans';

export interface DposAPI extends APIWrapper {
  /**
   * Default Node Address: ex: http://localhost:1234 (no leading slash)
   */
  nodeAddress: string;

  /**
   * Creates a new API Wrapper with the given node address.
   * So that you can be connected to multiple nodes at once.
   * @param nodeAddress Ex: http://localhost:1234 (no leading slash)
   */
  newWrapper(nodeAddress: string): APIWrapper;
}

export interface APIWrapper {
  /**
   * Accounts APIs
   */
  accounts: AccountsAPI;
  /**
   * Blocks Query APIs
   */
  blocks: BlocksAPI;
  /**
   * Node loading status APIs
   */
  loader: LoaderAPI;
  /**
   * Transactions APIs
   */
  transactions: TransactionsAPI;
  /**
   * Peers APIs
   */
  peers: PeersAPI;
  /**
   * Signature APIs
   */
  signatures: SignaturesAPI;
  /**
   * Delegates APIs
   */
  delegates: DelegatesAPI;
  /**
   * Multi Signature Accounts APIs
   */
  multiSignatures: MultiSignaturesAPI;

  /**
   * Decentralized Apps APIs (in progress)
   */
  dapps: DappsAPI;

  /**
   * Easily create a transport API without providing headers.
   * @param {boolean} flushCache flush current transportAPI cache
   * @returns {Promise<TransportApi>}
   */
  buildTransport: (flushCache?: boolean) => Promise<TransportApi>;

  /**
   * Access transport APIs
   * @param {TransportHeaders} headers
   * @returns {TransportApi}
   */
  transport: (headers: TransportHeaders) => TransportApi;

  rawRequest: <R>(obj: { noApiPrefix?: boolean, headers?: any, params?: any, path: string, method?: string, data?: any }, cback: cbackType<R>) => Promise<R & BaseApiResponse>;
}

export const dposAPI: DposAPI = (() => {
  const toRet = {
    nodeAddress: '',
    newWrapper(nodeAddress: string): APIWrapper {
      const req = requester(axios, nodeAddress);
      return addTransportBuilder(
        {
          accounts       : accounts(req),
          blocks         : blocks(req),
          dapps          : dapps(req),
          delegates      : delegates(req),
          loader         : loader(req),
          multiSignatures: multiSignatures(req),
          peers          : peers(req),
          rawRequest     : req,
          signatures     : signatures(req),
          transactions   : transactions(req),
          transport      : transport(req),
        },
        req
      );
    },
  } as DposAPI;

  function rproxy<R>(obj: { params?: any, path: string, method?: string, data?: any }, cback: cbackType<R>): Promise<R & BaseApiResponse> {
    return requester(axios, toRet.nodeAddress).apply(null, arguments);
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
  toRet.rawRequest      = rproxy;

  return addTransportBuilder(toRet, rproxy);
})();
