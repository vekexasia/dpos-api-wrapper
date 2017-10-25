import {expect} from 'chai';
import * as sinon from 'sinon';
import {peers} from '../../src/apis/peers';
import {PeerState} from '../../src/types/beans';

describe('Peers', () => {

  it('.getList should propagate query data as params and call /peers', () => {
    const stub = sinon.stub();
    peers(stub).getList({ state: PeerState.ACTIVE, os: 'ubuntu', version: '1' });
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/peers');
    expect(stub.firstCall.args[0].params).deep.eq({ state: PeerState.ACTIVE, os: 'ubuntu', version: '1' });
  });

  it('.getList empty params should propagate empty query data as params and call /peers', () => {
    const stub = sinon.stub();
    peers(stub).getList();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/peers');
    expect(stub.firstCall.args[0].params).deep.eq({  });
  });

  it('.getByIPPort should propagate query data as params and call /peers/get', () => {
    const stub = sinon.stub();
    peers(stub).getByIPPort({ ip: '127.0.0.1', port: 1111 });
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/peers/get');
    expect(stub.firstCall.args[0].params).deep.eq({ ip: '127.0.0.1', port: 1111 });
  });

  it('.version should call /peers/version', () => {
    const stub = sinon.stub();
    peers(stub).version();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/peers/version');
  });

});