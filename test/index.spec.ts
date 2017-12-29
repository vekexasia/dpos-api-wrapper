import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import {transport} from '../src/apis/transport';
import {APIWrapper, dposAPI} from '../src/index';

const { expect } = chai;
chai.use(chaiAsPromised);

const subpackages = ['accounts', 'blocks', 'dapps', 'delegates', 'loader', 'multiSignatures', 'peers', 'signatures', 'transactions'];
const functions   = ['buildTransport', 'transport'];

describe('dposAPI', () => {
  it('should have field nodeAddress', () => {
    expect(dposAPI.nodeAddress).to.be.string;
  });
  it('should have fn newWrapper', () => {
    expect(dposAPI.newWrapper).to.be.a('function');
  });

  it('should have timeout', () => {
    expect(dposAPI.timeout).to.be.a('number');
  });

  // subpackages.forEach((subPac) => {
  //   it(`should have called .${subPac}`, () => {
  //     expect(apiStub[subPac].calledOnce).is.true;
  //   });
  // });

  functions.forEach((fn) => {
    it(`should have .${fn}() defined and function`, () => {

      expect(dposAPI[fn]).to.exist;
      expect(dposAPI[fn]).to.be.a('function');
    });
  });

  describe('newWrapper', () => {
    let wrapp: APIWrapper;
    beforeEach(() => {
      wrapp = dposAPI.newWrapper('http://localhost.com');
    });
    it('should create a newWrapper with all the subpackages defined', () => {
      subpackages.forEach((sp) => expect(wrapp[sp]).to.exist);
      functions.forEach((sp) => expect(wrapp[sp]).to.exist);
    });
    it('should allow to define timeout which will be then read ', async () => {
      const opts = {timeout: 100000};
      let called = false;
      sinon.stub(opts, 'timeout').get(() => {
        called = true;
        return 5;
      });
      const w = dposAPI.newWrapper('http://localhost', opts);
      try { await w.blocks.getNethash(); } catch (e) {}
      expect(called).is.true;
    });
  });

  it('one method should call resolver and probably fail due to inexistent host', async () => {
    dposAPI.nodeAddress = 'http://127.0.0.1:7777';
    dposAPI.timeout = 10000;
    expect(dposAPI.loader.status()).to.be.rejected;
  });

});
