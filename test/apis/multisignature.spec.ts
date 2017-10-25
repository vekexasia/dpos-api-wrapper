import {expect} from 'chai';
import * as sinon from 'sinon';
import {multiSignatures} from '../../src/apis/multiSignatures';

describe('Multisignature', () => {

  it('.getPending should call /multisignatures/pending and propagate publicKey', () => {
    const stub = sinon.stub();
    multiSignatures(stub).getPending('publicKey');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/multisignatures/pending');
    expect(stub.firstCall.args[0].params).deep.eq({ publicKey: 'publicKey' });
  });

  it('.createMultiSigAccount should call PUT /multisignatures and propagate data', () => {
    const stub = sinon.stub();
    multiSignatures(stub).createMultiSigAccount({ a: 1, b: 2 } as any);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/multisignatures');
    expect(stub.firstCall.args[0].method).eq('PUT');
    expect(stub.firstCall.args[0].data).deep.eq({ a: 1, b: 2 });
  });

  it('.sign should call POST /multisignatures/sign and propagate data', () => {
    const stub = sinon.stub();
    multiSignatures(stub).sign({ a: 1, b: 2 } as any);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/multisignatures/sign');
    expect(stub.firstCall.args[0].method).eq('POST');
    expect(stub.firstCall.args[0].data).deep.eq({ a: 1, b: 2 });
  });

  it('.getAccounts should call /multisignatures/accounts and propagate publicKey', () => {
    const stub = sinon.stub();
    multiSignatures(stub).getAccounts('publicKey');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/multisignatures/accounts');
    expect(stub.firstCall.args[0].params.publicKey).deep.eq('publicKey');
  });

});