import {expect} from 'chai';
import {APIWrapper, dposAPI} from '../../src/index';

const subpackages = ['accounts', 'blocks', 'dapps', 'delegates', 'loader', 'multiSignatures', 'peers', 'signatures', 'transactions'];
const functions = ['buildTransport', 'transport'];
describe('dposAPI', () => {
  it('should have field nodeAddress', () => {
    expect(dposAPI.nodeAddress).to.be.string;
  });
  it('should have fn newWrapper', () => {
    expect(dposAPI.newWrapper).to.be.a('function');
  });

  subpackages.forEach((subPac) => {
    it(`should have .${subPac} defined`, () => {
      expect(dposAPI[subPac]).to.exist;
    });
    it(`.${subPac} should be an object`, () => {
      expect(dposAPI[subPac]).to.be.an('object');
    });
  });

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
});
