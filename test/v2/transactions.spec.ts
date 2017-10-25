import { expect } from 'chai';
import * as sinon from 'sinon';
import { transactions } from '../../src/apis/transactions';
import { apiBasicChecker } from './testutils';

describe('Transactions', () => {

  it('.getList should propagate params', async () => {
    const spy = sinon.spy();
    await transactions(spy).getList({blockId: '1'})
    apiBasicChecker(spy, '/transactions', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({blockId: '1'});
  });
  it('.count should call /count', async () => {
    const spy = sinon.spy();
    await transactions(spy).count();
    apiBasicChecker(spy, '/transactions/count', undefined);
  });
  it('.get should call /get', async () => {
    const spy = sinon.spy();
    await transactions(spy).get('1');
    apiBasicChecker(spy, '/transactions/get', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({id: '1'});
  });
  it('.getUnconfirmedTransactions should call /unconfirmed', async () => {
    const spy = sinon.spy();
    await transactions(spy).getUnconfirmedTransactions();
    apiBasicChecker(spy, '/transactions/unconfirmed', undefined);
  });
  it('.getUnconfirmedTransaction should call /unconfirmed/get with give param', async () => {
    const spy = sinon.spy();
    await transactions(spy).getUnconfirmedTransaction('1');
    apiBasicChecker(spy, '/transactions/unconfirmed/get', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({id: '1'});
  });
});