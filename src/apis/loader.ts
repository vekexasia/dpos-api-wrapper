import { LoaderAPI } from '../types/apis/LoaderAPI';
import { cback, rs as RsType} from '../types/base';
/**
 * @private
 * @internal
 */
export const loader = (rs: RsType): LoaderAPI => ({

  status(callback?: cback<{ loaded: boolean, now: number, blocksCount: number }>) {
    return rs({
        path: '/loader/status',
      },
      callback);
  },

  // tslint:disable-next-line max-line-length
  syncStatus(callback?: cback<{ syncing: boolean, blocks: number, height: number, broadhash: string, consensus: number }>) {
    return rs({
        path: '/loader/status/sync',
      },
      callback);
  },
});
