import { PeersAPI } from '../types/apis/PeersAPI';
import { cback, rs as RsType } from '../types/base';
import { Peer, PeerState } from '../types/beans';
// tslint:disable max-line-length
/**
 * @private
 * @internal
 */
export const peers = (rs: RsType): PeersAPI => ({
  getList(query: { state?: PeerState, os?: string, version?: string, limit?: number, offset?: number, orderBy?: string } = {}, callback?: cback<{ peers: Peer[] }>) {
    return rs({
      params: {...query},
      path: '/peers',
    }, callback);
  },

  getByIPPort(params: { ip: string, port: number }, callback?: cback<{ peer: Peer }>) {
    return rs({
      params: {...params},
      path: '/peers/get',
    }, callback);
  },

  version(callback?: cback<{ build: string, commit: string, version: string, minVersion: string }>) {
    return rs({
      path: '/peers/version',
    }, callback);
  },

});
