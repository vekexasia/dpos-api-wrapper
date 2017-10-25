import {expect} from 'chai';
import * as sinon from 'sinon';
import {delegates} from '../../src/apis/delegates';

describe('Delegates', () => {

  it('.enable', () => {
    const stub = sinon.stub();
    delegates(stub).enable({ secret: 'abc', username: 'abc' });
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates');
    expect(stub.firstCall.args[0].method).eq('PUT');
    expect(stub.firstCall.args[0].data).deep.eq({ secret: 'abc', username: 'abc' });
  });

  it('.getList', () => {
    const stub = sinon.stub();
    delegates(stub).getList({limit: 10, offset: 5});
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates');
    expect(stub.firstCall.args[0].params.limit).eq(10);
    expect(stub.firstCall.args[0].params.offset).eq(5);
  });

  it('.getList with no params should have empty object params', () => {
    const stub = sinon.stub();
    delegates(stub).getList();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates');
    expect(stub.firstCall.args[0].params).to.be.deep.eq({});
  });

  it('.getByKeyVal', () => {
    const stub = sinon.stub();
    delegates(stub).getByKeyVal('username', 'ahaha');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/get');
    expect(stub.firstCall.args[0].params.username).eq('ahaha');
  });

  it('.getByUsername calls getByKeyVal', () => {
    const stub       = sinon.stub();
    const delegatesAPI = delegates(stub);
    const keyValStub = sinon.stub(delegatesAPI, 'getByKeyVal');
    delegatesAPI.getByUsername('ahaha');
    expect(keyValStub.calledOnce).is.true;
    expect(keyValStub.firstCall.args[0]).deep.eq('username');
    expect(keyValStub.firstCall.args[1]).deep.eq('ahaha');
  });

  it('.getByPublicKey calls getByKeyVal', () => {
    const stub       = sinon.stub();
    const delegatesAPI = delegates(stub);
    const keyValStub = sinon.stub(delegatesAPI, 'getByKeyVal');
    delegatesAPI.getByPublicKey('ahaha');
    expect(keyValStub.calledOnce).is.true;
    expect(keyValStub.firstCall.args[0]).deep.eq('publicKey');
    expect(keyValStub.firstCall.args[1]).deep.eq('ahaha');
  });

  it('.getVoters', () => {
    const stub = sinon.stub();
    delegates(stub).getVoters('publicKey');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/voters');
    expect(stub.firstCall.args[0].params.publicKey).eq('publicKey');
  });

  it('.toggleForging true calls /forging/enable', () => {
    const stub = sinon.stub();
    delegates(stub).toggleForging({secret: 'secret', enable: true});
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/enable');
    expect(stub.firstCall.args[0].method).eq('POST');
    expect(stub.firstCall.args[0].data.secret).eq('secret');
  });

  it('.toggleForging true  calls /forging/disable', () => {
    const stub = sinon.stub();
    delegates(stub).toggleForging({secret: 'secret', enable: false});
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/disable');
    expect(stub.firstCall.args[0].method).eq('POST');
    expect(stub.firstCall.args[0].data.secret).eq('secret');
  });

  it('.getForgedByAccount string', () => {
    const stub = sinon.stub();
    delegates(stub).getForgedByAccount('publicKey');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/getForgedByAccount');
    expect(stub.firstCall.args[0].params).deep.eq({
      generatorPublicKey: 'publicKey',
    });
  });

  it('.getForgedByAccount object start-end', () => {
    const stub = sinon.stub();
    delegates(stub).getForgedByAccount({generatorPublicKey: 'publicKey', start: 0, end: 10});
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/getForgedByAccount');
    expect(stub.firstCall.args[0].params).deep.eq({
      generatorPublicKey: 'publicKey',
      start: 0,
      end: 10,
    });
  });

  it('.getForgingStatus with callback will propagate undefined publickey', () => {
    const stub = sinon.stub();
    delegates(stub).getForgingStatus(() => null);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/status');
    expect(stub.firstCall.args[0].params).deep.eq({publicKey: undefined});
  });

  it('.getForgingStatus no data will not propagate params', () => {
    const stub = sinon.stub();
    delegates(stub).getForgingStatus();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/status');
    expect(stub.firstCall.args[0].params).deep.eq({publicKey: undefined});
  });

  it('.getForgingStatus with publicKey will need to propagate it', () => {
    const stub = sinon.stub();
    delegates(stub).getForgingStatus('publicKey');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/forging/status');
    expect(stub.firstCall.args[0].params).deep.eq({publicKey: 'publicKey'});
  });

  it('.getNextForgers will call the correct endpoint and correct limit as param', () => {
    const stub = sinon.stub();
    delegates(stub).getNextForgers(10);
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/delegates/getNextForgers');
    expect(stub.firstCall.args[0].params).deep.eq({limit: 10});
  });
});