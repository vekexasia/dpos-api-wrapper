import {expect} from 'chai';
import * as sinon from 'sinon';
import {TransportApi, TransportHeaders} from '../../src/types/apis/TransportAPI';
import {transport} from '../../src/apis/transport';

describe('Transport', () => {
  let tr: TransportApi;
  let stub: sinon.SinonStub;
  const headers: TransportHeaders = {
    nethash: 'nethash',
    port   : 1111,
    version: '1.1.1',
  };
  beforeEach(() => {
    stub = sinon.stub();
    tr   = transport(stub)(headers);
  });

  it('.getHeight calls peer/getHeight + noApiPrefix and headers', () => {
    tr.getHeight();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/height');
  });

  it('.listPeers calls peer/list + noApiPrefix and headers', () => {
    tr.listPeers();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/list');
  });

  it('.ping calls peer/ping + noApiPrefix and headers', () => {
    tr.ping();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/ping');
  });

  it('.postTransactions calls peer/transactions in POST with data & noApiPrefix and headers', () => {
    tr.postTransactions([{ a: 1 } as any]);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].method).to.be.deep.eq('POST');
    expect(stub.firstCall.args[0].data).to.be.deep.eq({ transactions: [{ a: 1 }] });
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/transactions');
  });

  it('.postTransaction calls peer/transactions in POST with data & noApiPrefix and headers', () => {
    tr.postTransaction({ a: 1 } as any);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].method).to.be.deep.eq('POST');
    expect(stub.firstCall.args[0].data).to.be.deep.eq({ transaction: { a: 1 } });
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/transactions');
  });

  it('.postSignature calls peer/signatures in POST with data & noApiPrefix and headers', () => {
    tr.postSignature({ a: 1 } as any);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].method).to.be.deep.eq('POST');
    expect(stub.firstCall.args[0].data).to.be.deep.eq({ signature: { a: 1 } });
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/signatures');
  });

  it('.postSignature withArray calls peer/signatures in POST with data & noApiPrefix and headers', () => {
    tr.postSignature([{ a: 1 } as any]);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].headers).to.be.deep.eq(headers);
    expect(stub.firstCall.args[0].noApiPrefix).to.be.deep.eq(true);
    expect(stub.firstCall.args[0].method).to.be.deep.eq('POST');
    expect(stub.firstCall.args[0].data).to.be.deep.eq({ signatures: [{ a: 1 }] });
    expect(stub.firstCall.args[0].path).to.be.deep.eq('peer/signatures');
  });
});