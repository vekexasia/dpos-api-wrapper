import {expect} from 'chai';
import * as sinon from 'sinon';
import {loader} from '../../src/apis/loader';

describe('Loader', () => {

  it('.status should call /loader/status', () => {
    const stub = sinon.stub();
    loader(stub).status();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/loader/status');
  });

  it('.syncStatus should call /loader/status/sync', () => {
    const stub = sinon.stub();
    loader(stub).syncStatus();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/loader/status/sync');
  });

});