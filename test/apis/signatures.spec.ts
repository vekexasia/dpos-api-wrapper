import {expect} from 'chai';
import * as sinon from 'sinon';
import {signatures} from '../../src/apis/signatures';

describe('Signatures', () => {
  it('.add should call PUT /signatures with given data', () => {
    const stub = sinon.stub();
    signatures(stub).add({ a: 1, b: 2 } as any);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/signatures');
    expect(stub.firstCall.args[0].method).eq('PUT');
    expect(stub.firstCall.args[0].data).deep.eq({ a: 1, b: 2 });
  });

  it('.getSecondSignatureFee should call PUT /signatures/fee with given data', () => {
    const stub = sinon.stub();
    signatures(stub).getSecondSignatureFee();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/signatures/fee');
  });
});
