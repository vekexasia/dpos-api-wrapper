import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
import {transport} from './apis/transport';
import {BlocksAPI} from './types/apis/BlocksAPI';
import {PeersAPI} from './types/apis/PeersAPI';
import {TransportApi} from './types/apis/TransportAPI';
import {BaseApiResponse, cback as cbackType, rs as rsType} from './types/base';
import {BlockStatusResponse} from './types/beans';

export const requester = (axios: AxiosInstance, nodeAddress, opts: {timeout: number, errorAsResponse: boolean}) => <R>(obj: { noApiPrefix?: boolean, headers?: any, params?: any, path: string, method?: string, data?: any }, cback: cbackType<R>): Promise<R & BaseApiResponse> => {
  return axios({
    json   : true,
    timeout: opts.timeout,
    url    : `${nodeAddress}${obj.noApiPrefix ? '' : '/api'}${obj.path}`,
    ...obj,
  } as AxiosRequestConfig)
    .catch((err) => {
      if (err.response && err.response.data && !err.response.data.success) {
        if (opts.errorAsResponse) {
          return err.response;
        }
        return Promise.reject(new Error(err.response.data.error || err.response.data.message));
      }
      return Promise.reject(err);
    })
    .then((resp) => {
      if (resp.data.success === false) {
        if (opts.errorAsResponse) {
          return resp.data;
        }
        return Promise.reject(new Error(resp.data.error || resp.data.message));
      }
      return resp.data;
    })
    .then((a) => {
      if (typeof(cback) !== 'undefined') {
        cback(null, a);
      }
      return a;
    })
    .catch((err) => {
      if (typeof(cback) !== 'undefined') {
        cback(err);
      }
      return Promise.reject(err);
    });
};

/**
 * Augments the object adding a new buildTransport function
 */
export function addTransportBuilder<T extends { blocks: BlocksAPI, peers: PeersAPI }>(obj: T, rs: rsType): T & { buildTransport: (flushCache?: boolean) => Promise<TransportApi> } {
  let transportCache = null;
  // tslint:disable-next-line no-string-literal
  obj['buildTransport'] = (flushCache: boolean = false) => {
    if (flushCache || transportCache === null) {
      return Promise.all([
        obj.peers.version(),
        obj.blocks.getStatus(),
      ])
        .then((resp: [{ version: string }, BlockStatusResponse]) => ({
          nethash: resp[1].nethash,
          port   : 1000,
          version: resp[0].version,
        }))
        .then((h) => {
          transportCache = transport(rs)(h);
          return transportCache;
        });
    }
    return Promise.resolve(transportCache);
  };
  return obj as any; // TS bug 10727 on spread operators i need to do this.
}
