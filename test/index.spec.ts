import * as chai from 'chai';
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
  });

  it('one method should call resolver and probably fail due to inexistent host', async () => {
    dposAPI.nodeAddress = 'http://127.0.0.1:7777';
    expect(dposAPI.loader.status()).to.be.rejected;
  });

});
