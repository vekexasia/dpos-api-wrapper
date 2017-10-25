import {expect} from 'chai';
import * as sinon from 'sinon';
import {dapps} from '../../src/apis/dapps';

describe('Dapps', () => {
  it('.getCategories should call /dapps/categories', () => {
    const stub = sinon.stub();
    dapps(stub).getCategories();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/dapps/categories');
  });
});