import {expect} from 'chai';
import * as sinon from 'sinon';
import {transactions} from '../../src/apis/transactions';
import {apiBasicChecker} from './testutils';

describe('Transactions', () => {

  it('.getList should propagate params', () => {
    const spy = sinon.spy();
    transactions(spy).getList({ blockId: '1' })
    apiBasicChecker(spy, '/transactions', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({ blockId: '1' });
  });

  it('.getList with no params should propagate empty params', () => {
    const spy = sinon.spy();
    transactions(spy).getList()
    apiBasicChecker(spy, '/transactions', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({});
  });

  it('.count should call /count', () => {
    const spy = sinon.spy();
    transactions(spy).count();
    apiBasicChecker(spy, '/transactions/count', undefined);
  });
  it('.get should call /get', () => {
    const spy = sinon.spy();
    transactions(spy).get('1');
    apiBasicChecker(spy, '/transactions/get', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({ id: '1' });
  });

  it('.send should call PUT /transactions with data given', () => {
    const spy = sinon.spy();
    transactions(spy).send({ a: 1, b: 2 } as any);
    apiBasicChecker(spy, '/transactions', undefined);
    expect(spy.firstCall.args[0].method).is.deep.eq('PUT');
    expect(spy.firstCall.args[0].data).is.deep.eq({ a: 1, b: 2 });
  });
  it('.getUnconfirmedTransactions should call /unconfirmed', () => {
    const spy = sinon.spy();
    transactions(spy).getUnconfirmedTransactions();
    apiBasicChecker(spy, '/transactions/unconfirmed', undefined);
  });
  it('.getUnconfirmedTransaction should call /unconfirmed/get with give param', () => {
    const spy = sinon.spy();
    transactions(spy).getUnconfirmedTransaction('1');
    apiBasicChecker(spy, '/transactions/unconfirmed/get', undefined);
    expect(spy.firstCall.args[0].params).is.deep.eq({ id: '1' });
  });
});