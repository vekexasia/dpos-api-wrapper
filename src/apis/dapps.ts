import { DappsAPI } from '../types/apis/DappsAPI';
import { cback, rs as RsType } from '../types/base';

/**
 * @private
 * @internal
 */
export const dapps = (rs: RsType): DappsAPI => ({

  getCategories(callback?: cback<{ categories: { [k: string]: number } }>) {
    return rs({
      path: '/dapps/categories',
    }, callback);
  },
});
