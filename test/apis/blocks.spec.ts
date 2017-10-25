import {expect} from 'chai';
import * as sinon from 'sinon';
import {blocks} from '../../src/apis/blocks';

describe('Blocks', () => {

  it('.getFeeSchedule', () => {
    const stub = sinon.stub();
    blocks(stub).getFeeSchedule();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getFees');
  });

  it('.getFee', () => {
    const stub = sinon.stub();
    blocks(stub).getFee();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getFee');
  });

  it('.getReward', () => {
    const stub = sinon.stub();
    blocks(stub).getReward();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getReward');
  });

  it('.getSupply', () => {
    const stub = sinon.stub();
    blocks(stub).getSupply();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getSupply');
  });

  it('.getStatus', () => {
    const stub = sinon.stub();
    blocks(stub).getStatus();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getStatus');
  });

  it('.getHeight', () => {
    const stub = sinon.stub();
    blocks(stub).getHeight();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getHeight');
  });

  it('.getNethash', () => {
    const stub = sinon.stub();
    blocks(stub).getNethash();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getNethash');
  });

  it('.getMilestone', () => {
    const stub = sinon.stub();
    blocks(stub).getMilestone();
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/getMilestone');
  });

  it('.getBlock', () => {
    const stub = sinon.stub();
    blocks(stub).getBlock('1');
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks/get');
    expect(stub.firstCall.args[0].params).deep.eq({ id: '1' });
  });

  it('.getBlocks', () => {
    const stub = sinon.stub();
    blocks(stub).getBlocks({ limit: 2, height: 10 });
    expect(stub.calledOnce).is.true;
    expect(stub.firstCall.args[0].path).eq('/blocks');
    expect(stub.firstCall.args[0].params).deep.eq({ limit: 2, height: 10 });
  });

});